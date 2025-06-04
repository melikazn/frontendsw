import { useEffect, useState } from "react";
import api from "../../api/axios";
import CategorySelector from "../../components/Selector/CategorySelector";
import SectionSelector from "../../components/Selector/SectionSelector";

// Adminvy för att hantera kategorier och visa sektioner per kategori
function CategoryList() {
  // Tillstånd för kategorier, sektioner, fel, redigering och val
  const [categories, setCategories] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [sections, setSections] = useState<any[]>([]);

  // Hämta alla kategorier vid sidladdning
  useEffect(() => {
    fetchCategories();
  }, []);

  // Hämta sektioner när en kategori valts
  useEffect(() => {
    if (selectedCategoryId) fetchSections(selectedCategoryId);
  }, [selectedCategoryId]);

  // Hämta kategorier från backend
  const fetchCategories = async () => {
    try {
      const res = await api.get("/admin/categories");
      setCategories(res.data);
    } catch (err: any) {
      setError("Kunde inte hämta kategorier.");
    }
  };

  // Hämta sektioner och filtrera per kategori
  const fetchSections = async (categoryId: number) => {
    try {
      const res = await api.get("/admin/sections");
      const filtered = res.data.filter((s: any) => s.category_id === categoryId);
      setSections(filtered);
    } catch (err) {
      setSections([]);
    }
  };

  // Radera kategori med bekräftelse
  const handleDelete = async (id: number) => {
    if (!window.confirm("Vill du verkligen ta bort denna kategori?")) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert("Kunde inte ta bort kategori.");
    }
  };

  // Aktivera redigering
  const handleEdit = (id: number, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
  };

  // Spara ändrat namn på kategori
  const handleSaveEdit = async (id: number) => {
    try {
      await api.put(`/admin/categories/${id}`, { name: editName });
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      alert("Kunde inte uppdatera kategori.");
    }
  };

  // Starta test från en sektion
  const handleStartTest = (testId: number) => {
    window.location.href = `/dashboard/tests/start/${testId}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 mt-[100px] text-[#00296b]">
      <h2 className="text-2xl font-bold mb-6 text-center">📂 Hantera kategorier och sektioner</h2>

      {/* Felmeddelande */}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Lista över kategorier */}
      <ul className="space-y-6">
        {categories.map((cat) => (
          <li key={cat.id} className="bg-white rounded-lg shadow p-4 border border-gray-300">
            {editingId === cat.id ? (
              // Redigeringsläge
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="border px-3 py-2 rounded w-full sm:w-auto flex-1"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveEdit(cat.id)}
                    className="bg-yellow-400 text-white px-3 py-1 cursor-pointer rounded hover:bg-yellow-300"
                  >
                    💾 Spara
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-blue-400 px-3 py-1 cursor-pointer rounded hover:bg-blue-300"
                  >
                    ❌ Avbryt
                  </button>
                </div>
              </div>
            ) : (
              // Visningsläge
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <strong className="text-lg">{cat.name}</strong>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      🗑 Ta bort
                    </button>
                    <button
                      onClick={() => handleEdit(cat.id, cat.name)}
                      className="text-sm bg-yellow-400 text-[#00296b] px-3 py-1 rounded hover:bg-yellow-300"
                    >
                      ✏️ Redigera
                    </button>
                  </div>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Välj kategori och visa sektioner */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">Välj en kategori för att visa sektioner</h3>
        <CategorySelector
          categories={categories}
          selectedId={selectedCategoryId}
          onSelect={setSelectedCategoryId}
        />

        {selectedCategoryId && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Sektioner</h3>
            <SectionSelector
              sections={sections}
              onSelectSection={() => {}}
              onStartTest={handleStartTest}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryList;
