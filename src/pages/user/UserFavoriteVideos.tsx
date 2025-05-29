import { useEffect, useState } from "react";
import api from "../../api/axios";
import { FaHeart } from "react-icons/fa";

function UserFavoriteVideos() {
  const [videos, setVideos] = useState<any[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [letterFilter, setLetterFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [sortBy, setSortBy] = useState("titleAsc");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await api.get("/users/favorites/videos");
      setVideos(res.data);
      setFavoriteIds(res.data.map((v: any) => v.id));
    } catch (err) {
      setError("Kunde inte hämta favoritvideor.");
    }
  };

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

  const resetFilters = () => {
    setSearchTerm("");
    setLetterFilter("");
    setLevelFilter("");
    setSortBy("titleAsc");
    setCurrentPage(1);
  };

  const filteredVideos = videos.filter(v =>
    (!searchTerm || v.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!letterFilter || v.title.toUpperCase().startsWith(letterFilter)) &&
    (!levelFilter || v.level === levelFilter)
  );

  const sortedVideos = [...filteredVideos].sort((a, b) => {
    switch (sortBy) {
      case "titleAsc":
        return a.title.localeCompare(b.title);
      case "titleDesc":
        return b.title.localeCompare(a.title);
      case "newest":
        return b.id - a.id;
      case "oldest":
        return a.id - b.id;
      default:
        return 0;
    }
  });

  const paginatedVideos = sortedVideos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(sortedVideos.length / ITEMS_PER_PAGE);
  const letters = [...new Set(videos.map((v: any) => v.title.charAt(0).toUpperCase()))].sort();
  const levels = ["A1", "A2", "B1", "B2", "C1"];

  return (
    <div style={{ padding: "2rem" }}>
      <h2>❤️ Dina favoritvideor</h2>

      {/* Filtrering */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="🔍 Sök efter titel..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "0.5rem", width: "60%", marginRight: "1rem" }}
        />
        <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>
          <option value="">Filtrera nivå</option>
          {levels.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <strong>Filtrera bokstav:</strong>{" "}
        {letters.map(letter => (
          <button
            key={letter}
            style={{
              margin: "0 0.3rem",
              padding: "0.3rem 0.6rem",
              backgroundColor: letterFilter === letter ? "#007bff" : "#e0e0e0",
              color: letterFilter === letter ? "white" : "black",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
            onClick={() => setLetterFilter(prev => prev === letter ? "" : letter)}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Sortering och rensa */}
      <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "1rem" }}>
        <div>
          <label>Sortera: </label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="titleAsc">A–Ö</option>
            <option value="titleDesc">Ö–A</option>
            <option value="newest">Nyast först</option>
            <option value="oldest">Äldst först</option>
          </select>
        </div>
        <button
          onClick={resetFilters}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          🔄 Rensa filter
        </button>
      </div>

      {/* Visning */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {paginatedVideos.length === 0 ? (
        <p>Inga videor matchar dina filter.</p>
      ) : (
        <>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {paginatedVideos.map((video) => (
              <li key={video.id} style={{ marginBottom: "2rem" }}>
                <h3 style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: 0 }}>
                  {video.title}
                  <button
                    onClick={() => toggleFavorite(video.id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      margin: 0
                    }}
                    title="Ta bort från favoriter"
                  >
                    <FaHeart color="red" />
                  </button>
                </h3>
                <p><strong>Nivå:</strong> {video.level}</p>
                <video width="400" controls>
                  <source src={`http://localhost:5050/uploads/videos/${video.filename}`} type="video/mp4" />
                </video>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "2rem" }}>
              <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>
                ⬅ Föregående
              </button>
              <span>Sida {currentPage} av {totalPages}</span>
              <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>
                Nästa ➡
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default UserFavoriteVideos;
