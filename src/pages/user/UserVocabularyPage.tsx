import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { VocabularyWord } from "../../types";
import WordList from "../../components/Vocabulary/WordList";
import Pagination from "../../components/General/Pagination";

function UserVocabularyPage() {
  const { level, letter } = useParams();
  const navigate = useNavigate();

  const [words, setWords] = useState<VocabularyWord[]>([]);
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
    } catch (err) {
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
    <main className="flex-grow px-4 mt-[150px] py-10">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          📄 Ord på nivå {level} som börjar med {letter}
        </h2>

        <div className="text-center mb-6">
          <button
            onClick={() => navigate("/dashboard/vocabulary")}
            className="inline-block bg-[#fdc500] text-[#00296b] px-6 py-2 rounded-full cursor-pointer font-bold shadow-md hover:bg-[#ffe066] transition"
          >
            ⬅ Tillbaka till nivåval
          </button>
        </div>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        {words.length === 0 && !error ? (
          <p className="text-center text-gray-600">Inga ord hittades.</p>
        ) : (
          <>
            <WordList words={words} onToggleFavorite={toggleFavorite} />
            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
                onPrev={() => setPage((p) => Math.max(1, p - 1))}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default UserVocabularyPage;
