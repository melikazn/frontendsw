import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import LevelSelector from "../../components/Selector/LevelSelector";
import Dropdown from "../../components/General/Dropdown";

// Komponent för att skapa en ny sektion kopplad till en kategori och nivå
function AddSection() {
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState({ category_name: "", name: "", level: "" }); 
  const [message, setMessage] = useState<string | null>(null); 
  const navigate = useNavigate();

  // Hämta tillgängliga kategorier vid första render
  useEffect(() => {
    api.get("/admin/categories").then((res) => setCategories(res.data));
  }, []);

  // Hantera fältändringar för input-fält
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Skicka formuläret
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/admin/sections", form);
      setMessage(res.data.message || "Sektion skapad.");
      setTimeout(() => navigate("/admin/sections"), 1500);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "❌ Något gick fel.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-[160px] mb-20 px-4 sm:px-6 lg:px-8 text-[#00296b]">
      {/* Rubrik */}
      <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
        ➕ Lägg till sektion
      </h2>

      {/* Feedbackmeddelande */}
      {message && (
        <p className="mb-6 text-center bg-blue-50 text-blue-800 border border-blue-200 px-4 py-3 rounded shadow">
          {message}
        </p>
      )}

      {/* Formulär */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 space-y-6"
      >
        {/* Välj kategori från dropdown */}
        <Dropdown
          label="Kategori"
          selected={form.category_name}
          onChange={(value) => setForm({ ...form, category_name: value })}
          options={categories.map((cat) => ({ label: cat.name, value: cat.name }))}
        />

        {/* Input för sektionsnamn */}
        <div>
          <label className="block text-sm font-semibold mb-2">Sektionsnamn:</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            placeholder="T.ex. Substantiv - bestämd form"
          />
        </div>

        {/* Välj nivå (A1–C1) */}
        <div>
          <label className="block text-sm font-semibold mb-2">Nivå:</label>
          <LevelSelector
            level={form.level}
            onChange={(value) => setForm({ ...form, level: value })}
            showAllOption={false} 
          />
        </div>

        {/* Spara-knapp */}
        <div className="pt-4 text-center sm:text-right">
          <button
            type="submit"
            className="bg-[#004B94] w-full sm:w-auto text-white font-bold px-6 py-3 rounded-xl cursor-pointer shadow hover:bg-blue-800 transition"
          >
            💾 Skapa sektion
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddSection;
