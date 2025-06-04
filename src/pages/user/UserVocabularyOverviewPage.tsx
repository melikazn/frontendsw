import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import SearchInput from "../../components/General/SearchInput";
import Dropdown from "../../components/General/Dropdown";
import WordList from "../../components/Vocabulary/WordList";
import Pagination from "../../components/General/Pagination";
import LevelSelector from "../../components/Selector/LevelSelector";

function UserVocabularyOverviewPage() {
  const navigate = useNavigate();

  // States för sök, resultat, fel, filter och paginering
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedWordClass, setSelectedWordClass] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Funktion för att söka ord via API
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const res = await api.get("/users/vocabulary/search", {
        params: { query: searchQuery },
      });
      setResults(res.data);
      setError(null);
      setSelectedWordClass("");
      setSelectedLevel("");
      setCurrentPage(1);
    } catch (err) {
      console.error("Fel vid sökning:", err);
      setError("Det gick inte att söka efter ord.");
      setResults([]);
    }
  };

  // Återställ sök och filter
  const clearSearch = () => {
    setSearchQuery("");
    setResults(null);
    setError(null);
    setSelectedWordClass("");
    setSelectedLevel("");
    setCurrentPage(1);
  };

  // Favorit-hantering: toggle mellan att spara eller ta bort ord som favorit
  const toggleFavorite = async (wordId: number) => {
    try {
      const word = results?.find((w) => w.id === wordId);
      if (!word) return;

      if (word.is_favorite) {
        await api.delete(`/users/favorites/words/${wordId}`);
      } else {
        await api.post(`/users/favorites/words/${wordId}`);
      }

      setResults((prev) =>
        prev?.map((w) =>
          w.id === wordId ? { ...w, is_favorite: !w.is_favorite } : w
        ) || []
      );
    } catch (err) {
      console.error("Fel vid uppdatering av favorit", err);
    }
  };

  // Filtrering baserat på ordklass och nivå
  const filteredResults = results?.filter((word) => {
    return (
      (selectedWordClass === "" || word.word_class === selectedWordClass) &&
      (selectedLevel === "" || word.level === selectedLevel)
    );
  }) || [];

  // Paginering av filtrerade resultat
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Ordklass-filteralternativ
  const wordClassOptions = results
    ? Array.from(new Set(results.map((w) => w.word_class).filter(Boolean))).map(
        (cls) => ({ label: cls, value: cls })
      )
    : [];

  // CEFR-nivåer
  const levelOptions = ["A1", "A2", "B1", "B2", "C1"].map((lvl) => ({
    label: lvl,
    value: lvl,
  }));

  // UI och render
  return (
    <div className="w-full max-w-screen-xl mx-auto mt-[150px] text-center px-4 lg:px-12 xl:px-20">
      {/* Bild överst */}
      <img
        src="/images/search.png"
        className="mx-auto my-4 max-w-[300px] w-full h-auto"
        alt="Teacher icon"
        data-aos="flip-left"
      />

      {/* Sökfält */}
      <SearchInput
        query={searchQuery}
        onChange={setSearchQuery}
        onSearch={handleSearch}
        onClear={clearSearch}
      />

      {/* Om inget har sökts, visa nivåväljare */}
      {results === null && (
        <>
          <h2 className="text-xl sm:text-2xl font-bold text-[#004B94] my-8">
            Välj nivå och bokstav!
          </h2>

          <LevelSelector
            level={""}
            onChange={(value) => navigate(`/dashboard/vocabulary/${value}`)}
            label="CEFR-nivå"
            showAllOption={false}
          />
        </>
      )}

      {/* Felmeddelande */}
      {error && <p className="text-red-600 mt-4">{error}</p>}

      {/* Visar resultat om en sökning har gjorts */}
      {results !== null && (
        <div className="mt-10 bg-white p-6 rounded-xl shadow-xl text-left">
          <h2 className="text-xl font-semibold text-[#004B94] mb-6">📄 Sökresultat</h2>

          {/* Filter dropdowns */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Dropdown
              label="Ordklass"
              selected={selectedWordClass}
              onChange={setSelectedWordClass}
              options={[{ label: "📚 Alla ordklasser", value: "" }, ...wordClassOptions]}
            />

            <Dropdown
              label="Nivå"
              selected={selectedLevel}
              onChange={setSelectedLevel}
              options={[{ label: "🎯 Alla nivåer", value: "" }, ...levelOptions]}
            />
          </div>

          {/* Visar träffar eller meddelande om inga träffar */}
          {paginatedResults.length === 0 ? (
            <p className="text-gray-600">Inga resultat matchade filtren.</p>
          ) : (
            <>
              {/* Lista över ord */}
              <WordList words={paginatedResults} onToggleFavorite={toggleFavorite} />

              {/* Paginering */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default UserVocabularyOverviewPage;
