import { useEffect, useState } from "react";
import api from "../../api/axios";
import { motion } from "framer-motion";
import Pagination from "../../components/General/Pagination";
import LevelSelector from "../../components/Selector/LevelSelector";
import { FaHeart } from "react-icons/fa";
import SearchInput from "../../components/General/SearchInput";

function UserFavoriteVideos() {
  // States för data och filtrering
  const [videos, setVideos] = useState<any[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [letterFilter, setLetterFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Hämta favoritvideor vid laddning
  useEffect(() => {
    fetchFavorites();
  }, []);

  // Hämta favoritvideor från API
  const fetchFavorites = async () => {
    try {
      const res = await api.get("/users/favorites/videos");
      setVideos(res.data);
      setFavoriteIds(res.data.map((v: any) => v.id));
    } catch (err) {
      setError("Kunde inte hämta favoritvideor.");
    }
  };

  // Ta bort video från favoriter
  const toggleFavorite = async (videoId: number) => {
    try {
      if (favoriteIds.includes(videoId)) {
        await api.delete(`/users/favorites/videos/${videoId}`);
        setFavoriteIds(prev => prev.filter(id => id !== videoId));
        setVideos(prev => prev.filter(v => v.id !== videoId));
      }
    } catch (err) {
      console.error("Kunde inte uppdatera favoritstatus:", err);
    }
  };

  // Filtrera och sortera videor
  const filteredVideos = videos.filter(v =>
    (!searchTerm || v.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!letterFilter || v.title.toUpperCase().startsWith(letterFilter)) &&
    (!levelFilter || v.level === levelFilter)
  );

  const sortedVideos = [...filteredVideos].sort((a, b) => a.title.localeCompare(b.title));
  const paginatedVideos = sortedVideos.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(sortedVideos.length / ITEMS_PER_PAGE);
  const letters = [...new Set(videos.map((v: any) => v.title.charAt(0).toUpperCase()))].sort();

  return (
    <motion.div
      className="max-w-5xl mx-auto px-4 py-10 mt-[100px] text-[#00296b]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Illustration */}
      <img
        src="/images/favvideo.png"
        className="mx-auto my-4 max-w-[300px] w-full h-auto"
        alt="Teacher icon"
        data-aos="flip-left"
      />

      {/* Sökfält och nivåval */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
        <SearchInput
          query={searchTerm}
          onChange={setSearchTerm}
          onSearch={() => {}}
          onClear={() => setSearchTerm("")}
        />
        <LevelSelector level={levelFilter} onChange={setLevelFilter} />
      </div>

      {/* Filtrering per bokstav */}
      <div className="mb-6">
        <strong>Filtrera bokstav:</strong>
        <div className="flex flex-wrap gap-2 mt-2">
          {letters.map(letter => (
            <button
              key={letter}
              onClick={() => setLetterFilter(prev => prev === letter ? "" : letter)}
              className={`px-3 py-1 rounded-full text-sm shadow cursor-pointer ${letterFilter === letter ? "bg-blue-600 text-white" : "bg-yellow-200 text-gray-800"}`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Felmeddelande eller videolista */}
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {paginatedVideos.length === 0 ? (
        <p>Inga videor matchar dina filter.</p>
      ) : (
        <ul className="space-y-6">
          {paginatedVideos.map((video) => (
            <motion.li
              key={video.id}
              className="bg-yellow-100 p-4 rounded shadow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Titel och ta bort från favoriter */}
              <h3 className="text-blue-600 text-lg font-semibold mb-2 flex items-center justify-between">
                <span>{video.title}</span>
                <button onClick={() => toggleFavorite(video.id)} title="Ta bort från favoriter">
                  <FaHeart color="red" />
                </button>
              </h3>
              <p className="text-sm mb-1"><strong>Nivå:</strong> {video.level}</p>
              <video className="w-full max-w-md rounded" controls>
                <source src={`http://localhost:5050/uploads/videos/${video.filename}`} type="video/mp4" />
              </video>
            </motion.li>
          ))}
        </ul>
      )}

      {/* Paginering */}
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

export default UserFavoriteVideos;
