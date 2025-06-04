import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../api/axios";
import Footer from "../../components/layouts/FooterGuest";
import HeaderGuest from "../../components/layouts/HeaderGuest";
import SearchInput from "../../components/General/SearchInput";
import Dropdown from "../../components/General/Dropdown";
import Pagination from "../../components/General/Pagination";
import GuestWordList from "../../components/Vocabulary/GuestWordList";

function GuestVocabularyOverview() {
  const navigate = useNavigate();

  // definierade CEFR-nivåer
  const levels = ["A1", "A2", "B1", "B2", "C1"];

  // State-hantering
  const [searchQuery, setSearchQuery] = useState(""); 
  const [results, setResults] = useState<any[] | null>(null); 
  const [error, setError] = useState<string | null>(null);
  const [selectedWordClass, setSelectedWordClass] = useState(""); 
  const [selectedLevel, setSelectedLevel] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; 

  // Funktion för att söka i databasen
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const res = await api.get("/users/guestvocabulary/search", {
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

  // Rensar sökning och filter
  const clearSearch = () => {
    setSearchQuery("");
    setResults(null);
    setError(null);
    setSelectedWordClass("");
    setSelectedLevel("");
    setCurrentPage(1);
  };

  // Hanterar sidbyte i pagination
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  // Filtrerar resultat efter valda filter
  const filteredResults = results?.filter((word) => {
    return (
      (selectedWordClass === "" || word.word_class === selectedWordClass) &&
      (selectedLevel === "" || word.level === selectedLevel)
    );
  }) || [];

  // Beräknar total antal sidor
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);

  // Visar endast ord för aktuell sida
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Skapar val för ordklasser från resultaten
  const wordClassOptions = results
    ? Array.from(new Set(results.map((w) => w.word_class).filter(Boolean))).map(
        (cls) => ({ label: cls, value: cls })
      )
    : [];

  // Skapar val för nivåer
  const levelOptions = levels.map((lvl) => ({ label: lvl, value: lvl }));

  return (
    <div className="mt-[150px]">
      <HeaderGuest />
      <div className="max-w-4xl mx-auto mb-[300px] text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#004B94] mb-6">
          📘 Sök i ordförrådet bland 4000 ord
        </h2>

        {/* Bild */}
        <img
          src="/images/search.png"
          className="mx-auto my-4 max-w-[200px] w-full h-auto"
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

        {/* Felmeddelande */}
        {error && <p className="text-red-600 mt-4">{error}</p>}

        {/* Resultat */}
        {results !== null && (
          <div className="mt-10 bg-white p-6 rounded-xl shadow-xl text-left">
            <h2 className="text-xl font-semibold text-[#004B94] mb-6">
              📄 Sökresultat
            </h2>

            {/* Filter */}
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <Dropdown
                label="Ordklass"
                selected={selectedWordClass}
                onChange={(val) => {
                  setSelectedWordClass(val);
                  setCurrentPage(1);
                }}
                options={[{ label: "📚 Alla ordklasser", value: "" }, ...wordClassOptions]}
              />

              <Dropdown
                label="Nivå"
                selected={selectedLevel}
                onChange={(val) => {
                  setSelectedLevel(val);
                  setCurrentPage(1);
                }}
                options={[{ label: "🎯 Alla nivåer", value: "" }, ...levelOptions]}
              />
            </div>

            {/* Om inga matchningar */}
            {paginatedResults.length === 0 ? (
              <p className="text-gray-600">Inga resultat matchade filtren.</p>
            ) : (
              <>
                {/* Lista med ord */}
                <GuestWordList words={paginatedResults} />

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onNext={handleNextPage}
                  onPrev={handlePrevPage}
                />
              </>
            )}
          </div>
        )}

        <hr className="my-12" />

        {/* Manuell nivåval */}
        <h2 className="text-xl sm:text-2xl font-bold text-[#004B94] mb-4">
          📘 Välj en nivå
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => navigate(`/guestvocabulary/${level}`)}
              className="bg-[#fdc500] text-[#00296b] cursor-pointer rounded-full px-6 py-2 text-base sm:text-lg font-bold shadow-md transition-transform duration-300 hover:bg-[#ffe066] hover:scale-105"
            >
              {level}
            </button>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default GuestVocabularyOverview;
