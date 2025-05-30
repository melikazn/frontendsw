import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../api/axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";

function UserVocabularyOverview() {
  const navigate = useNavigate();
  const levels = ["A1", "A2", "B1", "B2", "C1"];

  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedWordClass, setSelectedWordClass] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

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

  const clearSearch = () => {
    setSearchQuery("");
    setResults(null);
    setError(null);
    setSelectedWordClass("");
    setSelectedLevel("");
    setCurrentPage(1);
  };

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

  const filteredResults = results?.filter((word) => {
    return (
      (selectedWordClass === "" || word.word_class === selectedWordClass) &&
      (selectedLevel === "" || word.level === selectedLevel)
    );
  }) || [];

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const wordClasses = results
    ? Array.from(new Set(results.map((w) => w.word_class).filter(Boolean)))
    : [];

  const inputStyle =
    "block mx-auto w-[200px] h-[35px] mb-[15px] px-[20px] py-2 border border-blue-400 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500";
  const buttonStyle =
    "bg-[#fdc500] text-[#00296b] rounded-full px-[30px] py-[11px]  text-5xl font-extrabold shadow-2xl transition-transform duration-300 hover:bg-[#ffe066] hover:scale-105 cursor-pointer mx-[10px] my-10";
  const LevelStyle =
    "bg-[#fdc500] text-[#00296b] rounded-full px-[20px] py-[11px]  text-5xl font-extrabold shadow-2xl transition-transform duration-300 hover:bg-[#ffe066] hover:scale-105 cursor-pointer mx-[10px] my-10";

  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold mb-4 text-[#004B94]">📘 Sök i ordförrådet</h2>

      <input
        type="text"
        placeholder="Sök ord..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className={inputStyle}
      />
      <div className="mt-4 space-x-2">
        <button onClick={handleSearch} className={buttonStyle}>
          🔍 Sök
        </button>
        <button onClick={clearSearch} className={buttonStyle}>
          ❌ Rensa
        </button>
      </div>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {results !== null && (
        <div className="mt-10 text-left max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 ml-[20px] text-[#004B94]">📄 Sökresultat:</h2>

          <div className="flex flex-wrap gap-4 text-[#004B94] mb-6">
<select
  value={selectedWordClass}
  onChange={(e) => {
    setSelectedWordClass(e.target.value);
    setCurrentPage(1);
  }}
  className="px-4 py-2 bg-white text-blue-800 font-serif border border-blue-400 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 p-[10px] m-[20px]"
>
  <option value="" >📚 Alla ordklasser</option>
  {wordClasses.map((cls) => (
    <option key={cls} value={cls}>
      {cls}
    </option>
  ))}
</select>

<select
  value={selectedLevel}
  onChange={(e) => {
    setSelectedLevel(e.target.value);
    setCurrentPage(1);
  }}
  className="px-4 py-2 bg-white text-blue-800 font-serif border border-blue-400 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 p-[10px] m-[20px]"
>
  <option value="">🎯 Alla nivåer</option>
  {levels.map((lvl) => (
    <option key={lvl} value={lvl}>
      {lvl}
    </option>
  ))}
</select>


          </div>

          {paginatedResults.length === 0 ? (
            <p>Inga resultat matchade filtren.</p>
          ) : (
            <>
              <ul className="space-y-4">
                {paginatedResults.map((word) => (
                  <li key={word.id} className="flex justify-between items-start border-b pb-2">
                    <div
                      className="cursor-pointer flex-1"
                      onClick={() => navigate(`/vocabulary/detail/${word.id}`)}
                    >
                      <strong className="text-blue-600 text-lg">{word.word}</strong> – {word.translation}
                      <div className="text-sm text-gray-500 mt-1">
                        📚 {word.word_class} | 🎯 {word.level}
                      </div>
                    </div>
                    <span
                      onClick={() => toggleFavorite(word.id)}
                      className="cursor-pointer ml-4"
                    >
                      {word.is_favorite ? (
                        <FaHeart className="text-red-500" />
                      ) : (
                        <FaRegHeart />
                      )}
                    </span>
                  </li>
                ))}
              </ul>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                  >
                    ◀ Föregående
                  </button>
                  <span className="text-sm font-medium text-gray-700">
                    Sida {currentPage} av {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                  >
                    Nästa ▶
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <hr className="my-12" />

      <h2 className="text-2xl font-bold mb-4 text-[#004B94]">📘 Välj en nivå</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {levels.map((level) => (
          <button
            key={level}
            onClick={() => navigate(`/vocabulary/${level}`)}
            className={LevelStyle}
          >
            {level}
          </button>
        ))}
      </div>
      
    </div>
    
  ); 
}

export default UserVocabularyOverview;

