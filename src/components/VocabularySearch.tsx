import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function VocabularySearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    setError(null);
    setResults([]);

    if (!query.trim()) {
      setError("Skriv något att söka efter.");
      return;
    }

    try {
      const res = await api.get("/admin/vocabulary/search", {
        params: { query }
      });
      setResults(res.data);
    } catch (err: any) {
      console.error("Fel vid sökning:", err);
      setError("Kunde inte hämta sökresultat.");
    }
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>🔍 Sök i VocabularyQuizStatsordförråd</h3>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Sökord, översättning, mening..."
        style={{ width: "60%", marginRight: "1rem" }}
      />
      <button onClick={handleSearch}>Sök</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {results.length > 0 && (
        <ul style={{ marginTop: "1rem" }}>
          {results.map((word) => (
            <li key={word.id}>
              <strong
                style={{ cursor: "pointer", color: "#007bff" }}
                onClick={() => navigate(`/admin/vocabulary/detail/${word.id}`)}
              >
                {word.word}
              </strong>{" "}
              – {word.translation} ({word.level})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default VocabularySearch;
