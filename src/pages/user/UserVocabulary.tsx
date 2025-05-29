import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";

function UserVocabulary() {
  const { level, letter } = useParams();
  const navigate = useNavigate();

  const [words, setWords] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [level, letter]);

  useEffect(() => {
    fetchWords();
  }, [level, letter, page]);

  const fetchWords = async () => {
    try {
      const res = await api.get("/users/vocabulary", {
        params: { level, letter, page },
      });

      setWords(res.data.words);
      setTotalPages(res.data.totalPages);
      setError(null);
    } catch (err: any) {
      console.error("Fel vid hämtning av ord:", err);
      setWords([]);
      setError("Det gick inte att hämta ordlistan.");
    }
  };

  const toggleFavorite = async (wordId: number) => {
    try {
      const word = words.find((w) => w.id === wordId);
      if (!word) return;

      if (word.is_favorite) {
        await api.delete(`/users/favorites/words/${wordId}`);
      } else {
        await api.post(`/users/favorites/words/${wordId}`);
      }

      // Uppdatera lokalt
      setWords((prev) =>
        prev.map((w) =>
          w.id === wordId ? { ...w, is_favorite: !w.is_favorite } : w
        )
      );
    } catch (err) {
      console.error("Fel vid uppdatering av favorit", err);
    }
  };

  return (
    <div>
      <h2>📄 Ord på nivå {level} som börjar med {letter}</h2>

      <button onClick={() => navigate("/vocabulary")}>⬅ Tillbaka till nivåval</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {words.length === 0 && !error ? (
        <p>Inga ord hittades.</p>
      ) : (
        <>
          <ul>
            {words.map((word) => (
              <li
                key={word.id}
                style={{ marginBottom: "0.5rem", display: "flex", alignItems: "center" }}
              >
                <span
                  style={{ cursor: "pointer", color: "#007bff", flexGrow: 1 }}
                  onClick={() => navigate(`/vocabulary/detail/${word.id}`)}
                >
                  <strong>{word.word}</strong>
                </span>
                <span
                  onClick={() => toggleFavorite(word.id)}
                  style={{ cursor: "pointer", marginLeft: "0.5rem" }}
                >
                  {word.is_favorite ? <FaHeart color="red" /> : <FaRegHeart />}
                </span>
              </li>
            ))}
          </ul>

          <div style={{ marginTop: "1rem" }}>
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              style={{ marginRight: "0.5rem" }}
            >
              ⬅ Föregående
            </button>
            <span>Sida {page} av {totalPages}</span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              style={{ marginLeft: "0.5rem" }}
            >
              Nästa ➡
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default UserVocabulary;
