import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { motion } from "framer-motion";
import CategorySelector from "../../components/Selector/CategorySelector";
import SectionSelector from "../../components/Selector/SectionSelector";
import Pagination from "../../components/General/Pagination";
import VideoFilterPanel from "../../components/Video/VideoFilterPanel";
import VideoList from "../../components/Video/VideoList";

function VideosByLevel() {
  const { level } = useParams();
  const navigate = useNavigate();

  // Tillstånd för kategorier, sektioner, videor och favoriter
  const [categories, setCategories] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  // Filtrering och visningsinställningar
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [letterFilter, setLetterFilter] = useState("");
  const [sortBy, setSortBy] = useState("titleAsc");
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleDescriptionId, setVisibleDescriptionId] = useState<number | null>(null);

  const ITEMS_PER_PAGE = 5;

  // Sorteringsalternativ
  const sortOptions = [
    { value: "titleAsc", label: "A–Ö" },
    { value: "titleDesc", label: "Ö–A" },
    { value: "newest", label: "Nyast först" },
    { value: "oldest", label: "Äldst först" },
  ];

  // Laddar kategorier vid första laddning eller när nivå ändras
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/users/categories");
        setCategories(res.data);
      } catch {
        setError("Kunde inte hämta kategorier.");
      }
    };

    fetchCategories();
    resetAll();
  }, [level]);

  // Laddar sektioner när en kategori väljs
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await api.get("/users/sections/by-category", {
          params: { categoryId: selectedCategoryId, level },
        });
        setSections(res.data);
      } catch {
        setError("Kunde inte hämta sektioner.");
      }
    };

    if (selectedCategoryId !== null) {
      fetchSections();
      setSelectedSectionId(null);
      setVideos([]);
    }
  }, [selectedCategoryId, level]);

  // Laddar videor och favoriter när en sektion väljs
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await api.get("/users/videos/by-section", {
          params: { sectionId: selectedSectionId },
        });
        setVideos(res.data);
      } catch {
        setError("Kunde inte hämta videor.");
      }
    };

    const fetchFavorites = async () => {
      try {
        const res = await api.get("/users/favorites/videos");
        setFavoriteIds(res.data.map((v: any) => v.id));
      } catch {
        console.error("Kunde inte hämta favoriter.");
      }
    };

    if (selectedSectionId !== null) {
      fetchVideos();
      fetchFavorites();
    }
  }, [selectedSectionId]);

  // Nollställer alla val
  const resetAll = () => {
    setSelectedCategoryId(null);
    setSelectedSectionId(null);
    setSections([]);
    setVideos([]);
    setCurrentPage(1);
    setSearchTerm("");
    setLetterFilter("");
    setSortBy("titleAsc");
  };

  // Hantera favoritmarkering
  const toggleFavorite = async (videoId: number) => {
    try {
      if (favoriteIds.includes(videoId)) {
        await api.delete(`/users/favorites/videos/${videoId}`);
        setFavoriteIds(prev => prev.filter(id => id !== videoId));
      } else {
        await api.post(`/users/favorites/videos/${videoId}`);
        setFavoriteIds(prev => [...prev, videoId]);
      }
    } catch {
      console.error("Fel vid favorit-hantering:");
    }
  };

  // Filtrering, sortering och paginering
  const filteredVideos = videos.filter(v =>
    (!searchTerm || v.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!letterFilter || v.title.toUpperCase().startsWith(letterFilter))
  );

  const sortedVideos = [...filteredVideos].sort((a, b) => {
    switch (sortBy) {
      case "titleAsc": return a.title.localeCompare(b.title);
      case "titleDesc": return b.title.localeCompare(a.title);
      case "newest": return b.id - a.id;
      case "oldest": return a.id - b.id;
      default: return 0;
    }
  });

  const paginatedVideos = sortedVideos.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(sortedVideos.length / ITEMS_PER_PAGE);
  const uniqueLetters = [...new Set(videos.map(v => v.title.charAt(0).toUpperCase()))].sort();

  return (
    <motion.div
      className="max-w-5xl mx-auto px-4 py-10 mt-[100px] text-[#00296b]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <button
        onClick={() => navigate("/dashboard/videos")}
        className="mb-4 px-5 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-500"
      >
        ⬅ Tillbaka till nivåer
      </button>

      <h2 className="text-2xl font-bold mb-6">🎞️ Videor – nivå {level}</h2>

      <CategorySelector categories={categories} selectedId={selectedCategoryId} onSelect={setSelectedCategoryId} />

      {selectedCategoryId !== null && (
        <div className="mt-6">
          <SectionSelector
            sections={sections}
            onSelectSection={setSelectedSectionId}
            onStartTest={(testId) => navigate(`/tester/${testId}`)}
          />
        </div>
      )}

      {selectedSectionId !== null && (
        <VideoFilterPanel
          search={searchTerm}
          onSearchChange={(val) => {
            setSearchTerm(val);
            setCurrentPage(1);
          }}
          sort={sortBy}
          onSortChange={setSortBy}
          sortOptions={sortOptions}
          letters={uniqueLetters}
          letterFilter={letterFilter}
          onLetterSelect={setLetterFilter}
        />
      )}

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {selectedSectionId !== null && sortedVideos.length === 0 && <p>Inga videor matchar dina filter.</p>}

      <VideoList
        videos={paginatedVideos}
        favorites={favoriteIds}
        visibleId={visibleDescriptionId}
        onToggleFavorite={toggleFavorite}
        onToggleDescription={(id) => setVisibleDescriptionId(prev => prev === id ? null : id)}
      />

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onNext={() => setCurrentPage(p => p + 1)}
          onPrev={() => setCurrentPage(p => p - 1)}
        />
      )}
    </motion.div>
  );
}

export default VideosByLevel;
