import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import Pagination from "../../components/General/Pagination";

function VocabularyList() {
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
      const res = await api.get("/admin/vocabulary", {
        params: { level, letter, page },
      });

      if (Array.isArray(res.data.words)) {
        setWords(res.data.words);
        setTotalPages(res.data.totalPages);
        setError(null);
      } else {
        setWords([]);
        setError("Oväntat svar från servern.");
        console.error("Oväntat svar:", res.data);
      }
    } catch (err: any) {
      console.error("Fel vid hämtning av ord:", err);
      setWords([]);
      if (err.response?.status === 401) {
        setError("Du är inte auktoriserad. Logga in igen.");
        setTimeout(() => navigate("/admin-login"), 1500);
      } else {
        setError("Det gick inte att hämta ordlistan.");
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Vill du verkligen ta bort detta ord?")) return;
    try {
      await api.delete(`/admin/vocabulary/${id}`);
      fetchWords(); // Uppdatera listan efter borttagning
    } catch (err) {
      console.error("Fel vid borttagning:", err);
      alert("Något gick fel vid borttagning.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-[100px] px-4 mb-20">
      <div className="flex flex-col items-center mb-8">
        <h2 className="text-3xl font-bold text-[#004B94] text-center mb-2">
          📄 Ord på nivå {level?.toUpperCase()} som börjar med {letter?.toUpperCase()}
        </h2>

        <button
          onClick={() => navigate("/admin/vocabulary")}
          className="mt-2 bg-gray-200 text-blue-800 px-5 py-2 rounded hover:bg-gray-300 transition"
        >
          ⬅ Tillbaka till nivåval
        </button>
      </div>

      {error && <p className="text-red-600 text-center font-semibold mb-6">{error}</p>}

      {words.length === 0 && !error ? (
        <p className="text-center text-gray-600">Inga ord hittades.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {words.map((word) => (
              <li
                key={word.id}
                className="bg-white shadow hover:shadow-md border rounded-lg p-4 flex justify-between items-center transition"
              >
                <div
                  onClick={() => navigate(`/admin/vocabulary/detail/${word.id}`)}
                  className="cursor-pointer flex-1"
                >
                  <p className="text-xl text-blue-700 font-semibold">{word.word}</p>
                  <p className="text-sm text-gray-600">{word.translation}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    📚 {word.word_class} | 🎯 {word.level}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(word.id)}
                  className="ml-6 bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700 text-sm"
                >
                  Ta bort
                </button>
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <div className="mt-10">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPrev={() => setPage((p) => Math.max(p - 1, 1))}
                onNext={() => setPage((p) => Math.min(p + 1, totalPages))}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default VocabularyList;
