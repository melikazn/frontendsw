import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import SearchInput from "../../components/General/SearchInput";
import Pagination from "../../components/General/Pagination";
import LevelSelector from "../../components/Selector/LevelSelector";
import AlphabetSelector from "../../components/Selector/AlphabetSelector";

const itemsPerPage = 20;

function AdminVocabulary() {
  const [selectedLevel, setSelectedLevel] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const res = await api.get("/users/vocabulary/search", {
        params: { query: searchQuery },
      });
      setResults(res.data);
      setCurrentPage(1);
      setError(null);
    } catch (err) {
      console.error("Sökfel:", err);
      setResults([]);
      setError("Det gick inte att söka efter ord.");
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setResults(null);
    setCurrentPage(1);
    setError(null);
  };

  const handleDelete = async (wordId: number) => {
    const confirmed = window.confirm("Är du säker på att du vill ta bort detta ord?");
    if (!confirmed) return;

    try {
      await api.delete(`/admin/vocabulary/${wordId}`);
      setResults((prev) => prev?.filter((w) => w.id !== wordId) || []);
    } catch (error) {
      console.error("Fel vid borttagning:", error);
      alert("Det gick inte att ta bort ordet.");
    }
  };

  const totalPages = Math.ceil((results?.length || 0) / itemsPerPage);
  const paginatedResults = results?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-4xl mx-auto mt-[100px] mb-20 px-4 text-center">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#004B94] mb-6">
        🛠️ Adminpanel – Hantera Ordförråd
      </h2>

      <img
        src="/images/search.png"
        alt="Admin icon"
        className="mx-auto my-4 max-w-[200px] w-full h-auto"
      />

      {/* Sökfält */}
      <div className="mb-6">
        <SearchInput
          query={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearch}
          onClear={clearSearch}
        />
      </div>

      {/* Sökresultat */}
      {results !== null && (
        <div className="bg-white p-6 rounded-xl shadow-xl text-left">
          <h3 className="text-xl font-semibold text-[#004B94] mb-4">📄 Sökresultat</h3>

          {paginatedResults?.length === 0 ? (
            <p className="text-gray-600">Inga resultat hittades.</p>
          ) : (
            <ul className="space-y-4">
              {paginatedResults?.map((word) => (
                <li
                  key={word.id}
                  className="flex justify-between items-center border-b pb-2 hover:bg-gray-100 p-2 rounded cursor-pointer"
                >
                  <div
                    onClick={() => navigate(`/admin/vocabulary/detail/${word.id}`)}
                    className="flex-1"
                  >
                    <strong className="text-blue-700 text-lg">{word.word}</strong> – {word.translation}
                    <div className="text-sm text-gray-500">
                      📚 {word.word_class} | 🎯 {word.level}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(word.id);
                    }}
                    className="ml-4 cursor-pointer px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                    Ta bort
                  </button>
                </li>
              ))}
            </ul>
          )}

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onNext={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            />
          )}
        </div>
      )}

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {/* Nivåval */}
      <h3 className="text-xl sm:text-2xl font-semibold text-[#004B94] mt-[100px] mb-4">
        🎯 Välj CEFR-nivå
      </h3>
      <LevelSelector
        level={selectedLevel}
        onChange={(val) => setSelectedLevel(val)}
        showAllOption={false}
      />

      {/* Bokstavsval */}
      {selectedLevel && <AlphabetSelector level={selectedLevel} />}
    </div>
  );
}

export default AdminVocabulary;
