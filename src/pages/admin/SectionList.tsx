import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/General/Pagination";
import LevelSelector from "../../components/Selector/LevelSelector";
import SearchInput from "../../components/General/SearchInput";
import Dropdown from "../../components/General/Dropdown";

function SectionList() {
  const [sections, setSections] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [filteredSections, setFilteredSections] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: "", level: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const sectionsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchSections();
    fetchCategories();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [sections, searchTerm, selectedLevel, selectedCategory]);

  const fetchSections = async () => {
    const res = await api.get("/admin/sections");
    setSections(res.data);
  };

  const fetchCategories = async () => {
    const res = await api.get("/admin/categories");
    setCategories(res.data);
  };

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
    setCurrentPage(1);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Vill du ta bort denna sektion?")) return;
    try {
      await api.delete(`/admin/sections/${id}`);
      fetchSections();
    } catch {
      alert("Kunde inte ta bort sektionen.");
    }
  };

  const handleEdit = (section: any) => {
    setEditingId(section.id);
    setEditForm({ name: section.name, level: section.level });
  };

  const handleSave = async (id: number) => {
    try {
      await api.put(`/admin/sections/${id}`, editForm);
      setEditingId(null);
      fetchSections();
    } catch {
      alert("Kunde inte uppdatera sektionen.");
    }
  };

  const indexOfLast = currentPage * sectionsPerPage;
  const indexOfFirst = indexOfLast - sectionsPerPage;
  const currentSections = filteredSections.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredSections.length / sectionsPerPage);

  return (
    <div className="max-w-6xl mx-auto px-4 mt-[100px] mb-20">
      <h2 className="text-2xl font-bold text-[#004B94] mb-6 mt-[120px] text-center">
        📋 Alla sektioner
      </h2>

      <SearchInput
        query={searchTerm}
        onChange={setSearchTerm}
        onSearch={applyFilters}
        onClear={() => setSearchTerm("")}
      />

      <div className="mb-[60px] flex mt-[60px] flex-col items-center gap-4">
        <Dropdown
          label="Kategori"
          selected={selectedCategory?.toString() || ""}
          onChange={(val) => setSelectedCategory(val ? parseInt(val) : null)}
          options={categories.map((cat) => ({ label: cat.name, value: cat.id.toString() }))}
        />
      </div >
      <div  className="mb-[70px]">
        <LevelSelector level={selectedLevel} onChange={setSelectedLevel} />
      </div>

      <ul className="space-y-6 mt-8">
        {currentSections.map((section) => (
          <li
            key={section.id}
            className="bg-white shadow rounded-lg p-5 border border-gray-200"
          >
            {editingId === section.id ? (
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <input
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md w-full"
                />
                <LevelSelector
                  level={editForm.level}
                  onChange={(lvl) => setEditForm({ ...editForm, level: lvl })}
                  showAllOption={false}
                />
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => handleSave(section.id)}
                    className="bg-yellow-400 text-white px-4 py-1 rounded cursor-pointer hover:bg-yellow-300"
                  >
                    💾 Spara
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-blue-400 cursor-pointer text-gray-800 px-4 py-1 rounded hover:bg-blue-300"
                  >
                    ❌ Avbryt
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="text-sm sm:text-base font-medium text-gray-800 mb-2">
                  <strong className="text-blue-800">{section.name}</strong>{" "}
                  ({section.level}) – Kategori: {" "}
                  <span className="text-gray-600">{section.category_name}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <button
                    onClick={() =>
                      navigate(`/admin/sections/${section.id}/videos`)
                    }
                    className="bg-yellow-100 cursor-pointer text-yellow-800 px-3 py-1 rounded hover:bg-yellow-200 text-sm"
                  >
                    📹 Video
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/admin/sections/${section.id}/tests`)
                    }
                    className="bg-indigo-100 cursor-pointer text-indigo-800 px-3 py-1 rounded hover:bg-indigo-200 text-sm"
                  >
                    🧪 Test
                  </button>
                  <button
                    onClick={() => handleEdit(section)}
                    className="bg-blue-100 cursor-pointer text-blue-800 px-3 py-1 rounded hover:bg-blue-200 text-sm"
                  >
                    ✏️ Redigera
                  </button>
                  <button
                    onClick={() => handleDelete(section.id)}
                    className="bg-red-100 cursor-pointer text-red-700 px-3 py-1 rounded hover:bg-red-200 text-sm"
                  >
                    🗑 Ta bort
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

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