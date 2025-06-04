import { useEffect, useState } from "react";
import api from "../../api/axios";
import AOS from "aos";
import "aos/dist/aos.css";
import SearchInput from "../../components/General/SearchInput";
import Dropdown from "../../components/General/Dropdown";
import FavoriteWordList from "../../components/Favorites/FavoriteWordList";
import VocabularyPagination from "../../components/General/Pagination";

function UserFavoritesWordsPage() {
  // State för data och filtrering
  const [favorites, setFavorites] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [sortBy, setSortBy] = useState("alphabetical-asc");
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  // Initierar AOS och hämtar favoriter
  useEffect(() => {
    AOS.init({ duration: 600, once: true });
    fetchFavorites();
  }, []);

  // Uppdaterar filtrerade ord när filter ändras
  useEffect(() => {
    filterAndSortFavorites();
  }, [favorites, searchTerm, selectedLetter, selectedLevel, sortBy]);

  // Hämtar favoriter från API
  const fetchFavorites = async () => {
    try {
      const res = await api.get("/users/favorites/words");
      setFavorites(res.data);
    } catch (err) {
      console.error("Kunde inte hämta favoriter:", err);
    }
  };

  // Tar bort ett favoritord från listan
  const removeFavorite = async (wordId: number) => {
    try {
      await api.delete(`/users/favorites/words/${wordId}`);
      setFavorites((prev) => prev.filter((word) => word.id !== wordId));
    } catch (err) {
      console.error("Fel vid borttagning av favorit:", err);
    }
  };

  // Filtrerar och sorterar favoritorden
  const filterAndSortFavorites = () => {
    let result = [...favorites];

    if (searchTerm.trim()) {
      result = result.filter((word) =>
        word.word.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedLetter) {
      result = result.filter((word) =>
        word.word.toLowerCase().startsWith(selectedLetter.toLowerCase())
      );
    }

    if (selectedLevel) {
      result = result.filter((word) => word.level === selectedLevel);
    }

    switch (sortBy) {
      case "alphabetical-asc":
        result.sort((a, b) => a.word.localeCompare(b.word));
        break;
      case "alphabetical-desc":
        result.sort((a, b) => b.word.localeCompare(a.word));
        break;
      case "newest":
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
    }

    setPage(1); // Starta om till sida 1
    setFiltered(result);
  };

  // Paginering
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  return (
    <div className="max-w-4xl mx-auto p-4 mt-[100px] sm:p-6 lg:p-8 text-[#00296b] font-sans relative z-0">

      <img
        src="/images/favwords.png"
        className="mx-auto my-4 max-w-[150px] mt-[20px] mb-[50px] w-full h-auto"
        alt="Teacher icon"
        data-aos="flip-left"
      />

      {/* Sökfält och återställning */}
      <SearchInput
        query={searchTerm}
        onChange={setSearchTerm}
        onSearch={filterAndSortFavorites}
        onClear={() => {
          setSearchTerm("");
          setSelectedLetter("");
          setSelectedLevel("");
          setSortBy("alphabetical-asc");
        }}
      />

      {/* Filtermenyer */}
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        <Dropdown
          label="Bokstav"
          selected={selectedLetter}
          onChange={setSelectedLetter}
          options={[{ label: "🔤 Alla bokstäver", value: "" },
            ...Array.from(new Set(favorites.map(f => f.word[0].toUpperCase())))
              .sort()
              .map(letter => ({ label: letter, value: letter }))
          ]}
        />

        <Dropdown
          label="Nivå"
          selected={selectedLevel}
          onChange={setSelectedLevel}
          options={[{ label: "🎯 Alla nivåer", value: "" },
            ...["A1", "A2", "B1", "B2", "C1"].map(lvl => ({ label: lvl, value: lvl }))
          ]}
        />

        <Dropdown
          label="Sortering"
          selected={sortBy}
          onChange={setSortBy}
          options={[
            { label: "A-Ö", value: "alphabetical-asc" },
            { label: "Ö-A", value: "alphabetical-desc" },
          ]}
        />
      </div>

      {/* Resultatlista eller fallback */}
      {paginated.length === 0 ? (
        <p className="text-gray-600">Inga matchande favoritord.</p>
      ) : (
        <FavoriteWordList words={paginated} onRemove={removeFavorite} />
      )}

      {/* Navigering mellan sidor */}
      {totalPages > 1 && (
        <VocabularyPagination
          currentPage={page}
          totalPages={totalPages}
          onNext={() => setPage((p) => Math.min(p + 1, totalPages))}
          onPrev={() => setPage((p) => Math.max(p - 1, 1))}
        />
      )}
    </div>
  );
}

export default UserFavoritesWordsPage;
