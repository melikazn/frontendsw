import { useEffect, useState } from "react";
import api from "../../api/axios";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function UserFavorites() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [sortBy, setSortBy] = useState("alphabetical-asc");
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  const navigate = useNavigate();

  useEffect(() => {
    fetchFavorites();
  }, []);

  useEffect(() => {
    filterAndSortFavorites();
  }, [favorites, searchTerm, selectedLetter, selectedLevel, sortBy]);

  const fetchFavorites = async () => {
    try {
      const res = await api.get("/users/favorites/words");
      setFavorites(res.data);
    } catch (err) {
      console.error("Kunde inte hämta favoriter:", err);
    }
  };

  const removeFavorite = async (wordId: number) => {
    try {
      await api.delete(`/users/favorites/words/${wordId}`);
      setFavorites(prev => prev.filter(word => word.id !== wordId));
    } catch (err) {
      console.error("Fel vid borttagning av favorit:", err);
    }
  };

  const filterAndSortFavorites = () => {
    let result = [...favorites];

    if (searchTerm.trim()) {
      result = result.filter(word =>
        word.word.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedLetter) {
      result = result.filter(word =>
        word.word.toLowerCase().startsWith(selectedLetter.toLowerCase())
      );
    }

    if (selectedLevel) {
      result = result.filter(word => word.level === selectedLevel);
    }

    switch (sortBy) {
      case "alphabetical-asc":
        result.sort((a, b) => a.word.localeCompare(b.word));
        break;
      case "alphabetical-desc":
        result.sort((a, b) => b.word.localeCompare(a.word));
        break;
      case "newest":
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
    }

    setPage(1);
    setFiltered(result);
  };

  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  return (
    <div style={{ maxWidth: 700, margin: "auto", padding: "2rem" }}>
      <h2>⭐ Mina favoritord</h2>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="🔍 Sök ord..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={selectedLetter} onChange={(e) => setSelectedLetter(e.target.value)}>
          <option value="">Alla bokstäver</option>
          {"ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ".split("").map(l => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
        <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}>
          <option value="">Alla nivåer</option>
          {["A1", "A2", "B1", "B2", "C1"].map(l => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="alphabetical-asc">A–Ö</option>
          <option value="alphabetical-desc">Ö–A</option>
          <option value="newest">Nyast först</option>
          <option value="oldest">Äldst först</option>
        </select>
        <button
          onClick={() => {
            setSearchTerm("");
            setSelectedLetter("");
            setSelectedLevel("");
            setSortBy("alphabetical-asc");
          }}
          style={{ backgroundColor: "#eee", padding: "0.5rem", cursor: "pointer" }}
        >
          🧹 Rensa filter
        </button>
      </div>

      {paginated.length === 0 ? (
        <p>Inga matchande favoritord.</p>
      ) : (
        <ul>
          {paginated.map((word) => (
            <li key={word.id} style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
              <span
                style={{ cursor: "pointer", color: "#007bff", flexGrow: 1 }}
                onClick={() => navigate(`/dashboard/vocabulary/detail/${word.id}`)}
              >
                <strong>{word.word}</strong> ({word.level})
              </span>
              <span
                onClick={() => removeFavorite(word.id)}
                style={{ cursor: "pointer", marginLeft: "0.5rem" }}
              >
                <FaHeart color="red" title="Ta bort från favoriter" />
              </span>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1rem" }}>
          <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>⬅</button>
          <span>Sida {page} av {totalPages}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>➡</button>
        </div>
      )}
    </div>
  );
}

export default UserFavorites;
