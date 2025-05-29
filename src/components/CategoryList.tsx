import { useEffect, useState } from "react";
import api from "../../api/axios";

function CategoryList() {
  const [categories, setCategories] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [expandedCategoryId, setExpandedCategoryId] = useState<number | null>(null);
  const [sections, setSections] = useState<Record<number, any[]>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/admin/categories");
      setCategories(res.data);
    } catch {
      setError("Kunde inte hämta kategorier.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Vill du verkligen ta bort denna kategori?")) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      fetchCategories();
    } catch {
      alert("Kunde inte ta bort kategori.");
    }
  };

  const handleEdit = (id: number, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
  };

  const handleSaveEdit = async (id: number) => {
    try {
      await api.put(`/admin/categories/${id}`, { name: editName });
      setEditingId(null);
      fetchCategories();
    } catch {
      alert("Kunde inte uppdatera kategori.");
    }
  };

  const toggleSections = async (categoryId: number) => {
    if (expandedCategoryId === categoryId) {
      setExpandedCategoryId(null);
    } else {
      try {
        const res = await api.get("/admin/sections");
        const filtered = res.data.filter((s: any) => s.category_id === categoryId);
        setSections(prev => ({ ...prev, [categoryId]: filtered }));
        setExpandedCategoryId(categoryId);
      } catch {
        alert("Kunde inte hämta sektioner.");
      }
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  return (
    <div className="max-w-3xl mx-auto mt-[100px] mb-20 px-4">
      <h2 className="text-2xl font-bold text-[#004B94] mb-4 text-center">📂 Kategorier</h2>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1); // återställ paginering vid ny sökning
        }}
        placeholder="🔍 Sök kategori..."
        className="w-full max-w-md mx-auto mb-6 px-4 py-2 border border-blue-400 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <ul className="space-y-6">
        {currentCategories.map((cat) => (
          <li
            key={cat.id}
            className="bg-white rounded-lg shadow p-5 border border-gray-200"
          >
            {editingId === cat.id ? (
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveEdit(cat.id)}
                    className="bg-green-600 text-white px-4 py-1 cursor-pointer rounded hover:bg-green-700"
                  >
                    💾 Spara
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-300 text-gray-800 px-4 cursor-pointer py-1 rounded hover:bg-gray-400"
                  >
                    ❌ Avbryt
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-3">
                  <strong className="text-lg text-[#004B94]">{cat.name}</strong>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-red-600 hover:text-red-800 cursor-pointer font-medium text-sm"
                    >
                      🗑 Ta bort
                    </button>
                    <button
                      onClick={() => handleEdit(cat.id, cat.name)}
                      className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium text-sm"
                    >
                      ✏️ Redigera
                    </button>
                    <button
                      onClick={() => toggleSections(cat.id)}
                      className="text-yellow-700 hover:text-yellow-900 cursor-pointer font-medium text-sm"
                    >
                      📁 Sektioner
                    </button>
                  </div>
                </div>

                {expandedCategoryId === cat.id && (
                  <div className="mt-4 border-t pt-3 pl-3 border-blue-300">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      Sektioner för {cat.name}:
                    </h4>
                    {sections[cat.id]?.length ? (
                      <ul className="list-disc pl-6 text-sm text-gray-700">
                        {sections[cat.id].map((s: any) => (
                          <li key={s.id}>
                            {s.name}{" "}
                            <span className="text-gray-500">({s.level})</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-600">Inga sektioner hittades.</p>
                    )}
                  </div>
                )}
              </>
            )}
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded disabled:opacity-50"
          >
            ◀ Föregående
          </button>
          <span className="text-sm text-gray-700">
            Sida {currentPage} av {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded disabled:opacity-50"
          >
            Nästa ▶
          </button>
        </div>
      )}
    </div>
  );
}

export default CategoryList;
