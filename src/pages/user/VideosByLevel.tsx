import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";
import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import CategorySelector from "../../components/Selector/CategorySelector";
import SectionSelector from "../../components/Selector/SectionSelector";
import Pagination from "../../components/General/Pagination";

function VideosByLevel() {
  const { level } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [letterFilter, setLetterFilter] = useState("");
  const [sortBy, setSortBy] = useState("titleAsc");
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleDescriptionId, setVisibleDescriptionId] = useState<number | null>(null);
  const ITEMS_PER_PAGE = 5;

  const sortOptions = [
    { value: "titleAsc", label: "A–Ö" },
    { value: "titleDesc", label: "Ö–A" },
    { value: "newest", label: "Nyast först" },
    { value: "oldest", label: "Äldst först" },
  ];

  useEffect(() => {
    fetchCategories();
    resetAll();
  }, [level]);

  useEffect(() => {
    if (selectedCategoryId !== null) {
      fetchSections();
      setSelectedSectionId(null);
      setVideos([]);
    }
  }, [selectedCategoryId]);

  useEffect(() => {
    if (selectedSectionId !== null) {
      fetchVideos();
      fetchFavorites();
    }
  }, [selectedSectionId]);

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

  const fetchCategories = async () => {
    try {
      const res = await api.get("/users/categories");
      setCategories(res.data);
    } catch {
      setError("Kunde inte hämta kategorier.");
    }
  };

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

  const paginatedVideos = sortedVideos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(sortedVideos.length / ITEMS_PER_PAGE);

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

      <CategorySelector
        categories={categories}
        selectedId={selectedCategoryId}
        onSelect={setSelectedCategoryId}
      />

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
        <div className="mb-6 space-y-4 mt-6">
          <input
            type="text"
            placeholder="🔍 Sök efter titel..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-2/3 border border-gray-300 rounded px-4 py-2"
          />

          <div>
            <strong>Filtrera bokstav:</strong>{" "}
            <div className="flex flex-wrap gap-2 mt-1">
              {[...new Set(videos.map(v => v.title.charAt(0).toUpperCase()))].sort().map(letter => (
                <button
                  key={letter}
                  onClick={() => setLetterFilter(prev => prev === letter ? "" : letter)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium shadow cursor-pointer ${letterFilter === letter ? 'bg-blue-500 text-white' : 'bg-yellow-200 text-gray-800'}`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>

          <div className="w-60 relative z-10">
            <Listbox value={sortBy} onChange={setSortBy}>
              <Listbox.Button className="relative w-full cursor-default rounded-xl border border-blue-400 bg-white py-2 pl-4 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <span className="block truncate">
                  {sortOptions.find(o => o.value === sortBy)?.label}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <ChevronUpDownIcon className="h-5 w-5 text-blue-600" />
                </span>
              </Listbox.Button>
              <Listbox.Options className="absolute mt-1 w-full rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm z-10">
                {sortOptions.map((option) => (
                  <Listbox.Option
                    key={option.value}
                    value={option.value}
                    className="cursor-pointer select-none px-4 py-2 hover:bg-blue-100"
                  >
                    {option.label}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Listbox>
          </div>
        </div>
      )}

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {selectedSectionId !== null && sortedVideos.length === 0 && <p>Inga videor matchar dina filter.</p>}

      {paginatedVideos.length > 0 && (
        <ul className="space-y-6 mt-6">
          {paginatedVideos.map((video) => (
            <motion.li
              key={video.id}
              className="bg-yellow-100 p-6 rounded-2xl shadow-md cursor-pointer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center gap-3">
                <button onClick={() => toggleFavorite(video.id)}>
                  <FaHeart color={favoriteIds.includes(video.id) ? "red" : "#ccc"} />
                </button>
                <h3
                  onClick={() => setVisibleDescriptionId(prev => prev === video.id ? null : video.id)}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  {video.title}
                </h3>
              </div>
              {visibleDescriptionId === video.id && (
                <div className="mt-3 space-y-2">
                  <p>{video.description}</p>
                  <p className="text-sm text-gray-600 font-medium">📁 Sektion: {video.section_name}</p>
                  <video className="w-full max-w-xl rounded-xl shadow" controls>
                    <source src={video.video_url} type="video/mp4" />
                  </video>
                  <p className="text-xs text-gray-500">📅 Uppladdad: {new Date(video.uploaded_at).toLocaleString()}</p>
                </div>
              )}
            </motion.li>
          ))}
        </ul>
      )}

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