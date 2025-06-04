import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { VocabularyWord } from "../../types";
import WordList from "../../components/Vocabulary/WordList";
import Pagination from "../../components/General/Pagination";

// Komponent för att visa ord baserat på CEFR-nivå och första bokstav
function UserVocabularyPage() {
  // Hämta nivå och bokstav från URL-parametrar
  const { level, letter } = useParams();
  const navigate = useNavigate();

  // State för ord, felmeddelande, aktuell sida och totalt antal sidor
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Återställ sida till 1 när nivå eller bokstav ändras
  useEffect(() => {
    setPage(1);
  }, [level, letter]);

  // Hämta ord varje gång nivå, bokstav eller sida ändras
  useEffect(() => {
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

    fetchWords();
  }, [level, letter, page]);

  // Lägg till eller ta bort favoritstatus för ett ord
  const toggleFavorite = async (wordId: number) => {
    try {
      const word = words.find((w) => w.id === wordId);
      if (!word) return;

      // Uppdatera favoritstatus i backend
      if (word.is_favorite) {
        await api.delete(`/users/favorites/words/${wordId}`);
      } else {
        await api.post(`/users/favorites/words/${wordId}`);
      }

      // Uppdatera lokal state
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
        {/* Titel */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          📄 Ord på nivå {level} som börjar med {letter}
        </h2>

        {/* Tillbaka-knapp */}
        <div className="text-center mb-6">
          <button
            onClick={() => navigate("/dashboard/vocabulary")}
            className="inline-block bg-[#fdc500] text-[#00296b] px-6 py-2 rounded-full cursor-pointer font-bold shadow-md hover:bg-[#ffe066] transition"
          >
            ⬅ Tillbaka till nivåval
          </button>
        </div>

        {/* Felmeddelande vid misslyckad hämtning */}
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        {/* Visar meddelande om inga ord hittades */}
        {words.length === 0 && !error ? (
          <p className="text-center text-gray-600">Inga ord hittades.</p>
        ) : (
          <>
            {/* Lista med ord och favoritfunktion */}
            <WordList words={words} onToggleFavorite={toggleFavorite} />

            {/* Paginering om det finns fler sidor */}
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
