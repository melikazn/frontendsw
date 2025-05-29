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

  if (error)
    return <p className="text-red-600 text-center mt-10">{error}</p>;

  if (!word)
    return <p className="text-center mt-10 text-gray-600">Laddar ord...</p>;

  return (
  <div className="min-h-screen flex flex-col mt-[100px] bg-white text-[#00296b] font-sans">
    <main className="flex-grow px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 bg-[#fdc500] cursor-pointer text-[#00296b] px-5 py-2 rounded-full font-bold shadow hover:bg-[#ffe066] transition"
        >
          ⬅ Tillbaka
        </button>

        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          📘 Orddetaljer
        </h2>

        <div className="space-y-4 text-base sm:text-lg">
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
    </main>
  </div>
);

}

export default UserVocabularyDetail;
