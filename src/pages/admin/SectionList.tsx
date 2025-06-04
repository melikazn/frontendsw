import { useEffect, useState } from "react";
import api from "../../api/axios";
import Pagination from "../../components/General/Pagination";
import LevelSelector from "../../components/Selector/LevelSelector";
import SearchInput from "../../components/General/SearchInput";
import Dropdown from "../../components/General/Dropdown";
import SectionItem from "../../components/Section/SectionListItem";
import EditSectionForm from "../../components/Section/EditSectionForm";

// Admin-vy för att lista, filtrera, redigera och ta bort sektioner
function SectionList() {
  // Sektioner, kategorier och filtrerade sektioner
  const [sections, setSections] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [filteredSections, setFilteredSections] = useState<any[]>([]);

  // Filtreringstillstånd
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Redigeringstillstånd
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: "", level: "" });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const sectionsPerPage = 10;



  // Hämta sektioner och kategorier vid komponentens start
  useEffect(() => {
    fetchSections();
    fetchCategories();
  }, []);

  // Applicera filter varje gång sektioner eller filter ändras
  useEffect(() => {
    applyFilters();
  }, [sections, searchTerm, selectedLevel, selectedCategory]);

  // Hämta sektioner från API
  const fetchSections = async () => {
    const res = await api.get("/admin/sections");
    setSections(res.data);
  };

  // Hämta kategorier från API
  const fetchCategories = async () => {
    const res = await api.get("/admin/categories");
    setCategories(res.data);
  };

  // Filtrerar sektioner enligt sökterm, nivå och kategori
  const applyFilters = () => {
    let filtered = sections;
    if (searchTerm) {
      filtered = filtered.filter((s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedLevel) {
      filtered = filtered.filter((s) => s.level === selectedLevel);
    }
    if (selectedCategory) {
      filtered = filtered.filter((s) => s.category_id === selectedCategory);
    }
    setFilteredSections(filtered);
    setCurrentPage(1); // återställ till första sidan
  };

  // Radera sektion med bekräftelse
  const handleDelete = async (id: number) => {
    if (!window.confirm("Vill du ta bort denna sektion?")) return;
    try {
      await api.delete(`/admin/sections/${id}`);
      fetchSections();
    } catch {
      alert("Kunde inte ta bort sektionen.");
    }
  };

  // Starta redigering
  const handleEdit = (section: any) => {
    setEditingId(section.id);
    setEditForm({ name: section.name, level: section.level });
  };

  // Spara ändringar
  const handleSave = async (id: number) => {
    try {
      await api.put(`/admin/sections/${id}`, editForm);
      setEditingId(null);
      fetchSections();
    } catch {
      alert("Kunde inte uppdatera sektionen.");
    }
  };

  // Paginering
  const indexOfLast = currentPage * sectionsPerPage;
  const indexOfFirst = indexOfLast - sectionsPerPage;
  const currentSections = filteredSections.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredSections.length / sectionsPerPage);

  return (
    <div className="max-w-6xl mx-auto px-4 mt-[100px] mb-20">
      <h2 className="text-2xl font-bold text-[#004B94] mb-6 mt-[120px] text-center">
        📋 Alla sektioner
      </h2>

      {/* Sökfält */}
      <SearchInput
        query={searchTerm}
        onChange={setSearchTerm}
        onSearch={applyFilters}
        onClear={() => setSearchTerm("")}
      />

      {/* Filtrering: kategori och nivå */}
      <div className="mb-[60px] flex mt-[60px] flex-col items-center gap-4">
        <Dropdown
          label="Kategori"
          selected={selectedCategory?.toString() || ""}
          onChange={(val) => setSelectedCategory(val ? parseInt(val) : null)}
          options={categories.map((cat) => ({
            label: cat.name,
            value: cat.id.toString(),
          }))}
        />
      </div>

      <div className="mb-[70px]">
        <LevelSelector level={selectedLevel} onChange={setSelectedLevel} />
      </div>

      {/* Lista över sektioner */}
      <ul className="space-y-6 mt-8">
        {currentSections.map((section) => (
          <li
            key={section.id}
            className="bg-white shadow rounded-lg p-5 border border-gray-200"
          >
            {editingId === section.id ? (
              <EditSectionForm
                editForm={editForm}
                setEditForm={setEditForm}
                onSave={() => handleSave(section.id)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <SectionItem
                section={section}
                onEdit={() => handleEdit(section)}
                onDelete={() => handleDelete(section.id)}
              />
            )}
          </li>
        ))}
      </ul>

      {/* Paginering */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
        />
      )}
    </div>
  );
}

export default SectionList;
