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
      fetchWords();
    } catch (err) {
      console.error("Fel vid borttagning:", err);
      alert("Något gick fel vid borttagning.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 mt-[100px] mb-20 text-center">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#004B94] mb-6">
        📄 Ord på nivå {level?.toUpperCase()} som börjar med {letter?.toUpperCase()}
      </h2>

      <button
        onClick={() => navigate("/admin/vocabulary")}
        className="mb-6 bg-gray-200 cursor-pointer text-blue-800 px-4 py-2 rounded hover:bg-gray-300"
      >
        ⬅ Tillbaka till nivåval
      </button>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {words.length === 0 && !error ? (
        <p className="text-gray-600">Inga ord hittades.</p>
      ) : (
        <>
          <ul className="space-y-4 text-left">
            {words.map((word) => (
              <li
                key={word.id}
                className="flex justify-between items-center border-b pb-2 hover:bg-gray-50 p-2 rounded"
              >
                <div
                  onClick={() => navigate(`/admin/vocabulary/detail/${word.id}`)}
                  className="cursor-pointer flex-1 text-blue-700 font-medium"
                >
                  <strong className="text-lg">{word.word}</strong> – {word.translation}
                  <div className="text-sm text-gray-500">
                    📚 {word.word_class} | 🎯 {word.level}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(word.id)}
                  className="ml-4 bg-red-600 text-white px-3 cursor-pointer py-1 rounded hover:bg-red-700 text-sm"
                >
                  Ta bort
                </button>
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPrev={() => setPage((p) => Math.max(p - 1, 1))}
              onNext={() => setPage((p) => Math.min(p + 1, totalPages))}
            />
          )}
        </>
      )}
    </div>
  );
}

export default VocabularyList;
