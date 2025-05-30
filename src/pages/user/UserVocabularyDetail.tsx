import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";

function UserVocabularyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [word, setWord] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWordDetail();
  }, [id]);

  const fetchWordDetail = async () => {
    try {
      const res = await api.get(`/users/vocabulary/detail/${id}`); 
      setWord(res.data);
    } catch (err) {
      console.error("Kunde inte hämta orddetaljer:", err);
      setError("Det gick inte att hämta ordet.");
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!word) return <p>Laddar ord...</p>;

  return (
    <div style={{ maxWidth: 700, margin: "auto", padding: "2rem" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "1rem" }}>
        ⬅ Tillbaka
      </button>
      <h2>📘 Orddetaljer</h2>

      <div style={{ marginBottom: "1rem" }}>
        <p><strong>📝 Ord:</strong> {word.word}</p>
        <p><strong>📚 Ordklass:</strong> {word.word_class}</p>
        {word.article && <p><strong>📰 Artikel:</strong> {word.article}</p>}
        <p><strong>🔤 Former:</strong> {Array.isArray(word.forms) ? word.forms.join(", ") : word.forms}</p>
        <p><strong>💬 Mening:</strong> {word.meaning}</p>
        <p><strong>🟰 Synonymer:</strong> {Array.isArray(word.synonyms) ? word.synonyms.join(", ") : word.synonyms}</p>
        <p><strong>🌍 Översättning:</strong> {word.translation}</p>
        <p><strong>📌 Exempel:</strong> {word.example}</p>
        <p><strong>🎯 Nivå:</strong> {word.level}</p>
      </div>
    </div>
  );
}

export default UserVocabularyDetail;
