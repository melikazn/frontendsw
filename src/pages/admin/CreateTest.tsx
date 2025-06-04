import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

// Komponent för att skapa ett nytt test och sedan gå till frågeformuläret
function CreateTest() {
  const [sections, setSections] = useState<any[]>([]); 
  const [form, setForm] = useState({ section_id: "", title: "" }); 
  const [message, setMessage] = useState<string | null>(null); 
  const navigate = useNavigate();

  // Hämta sektioner vid komponentens start
  useEffect(() => {
    api.get("/admin/sections").then(res => setSections(res.data));
  }, []);

  // Skickar formuläret till backend för att skapa ett test
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/admin/tests", form);
      const testId = res.data.id;
      navigate(`/admin/tests/${testId}/questions`); 
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Något gick fel");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-[200px] mb-[200px] px-4">
      <h2 className="text-2xl font-bold text-[#004B94] mb-6 text-center">🧪 Skapa nytt test</h2>

      {/* Visar felmeddelande vid behov */}
      {message && (
        <p className="mb-4 text-sm font-medium text-center text-red-800 bg-red-100 px-4 py-2 rounded shadow">
          {message}
        </p>
      )}

      {/* Formulär för att skapa test */}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-6 space-y-5">
        {/* Sektion */}
        <div>
          <label className="block text-sm font-semibold mb-1">Välj sektion:</label>
          <select
            name="section_id"
            required
            value={form.section_id}
            onChange={(e) => setForm({ ...form, section_id: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">-- Välj --</option>
            {sections.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.level})
              </option>
            ))}
          </select>
        </div>

        {/* Titel */}
        <div>
          <label className="block text-sm font-semibold mb-1">Titel på test:</label>
          <input
            type="text"
            name="title"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="T.ex. Grammatiktest 1"
          />
        </div>

        {/* Skapa-knapp */}
        <div className="text-right">
          <button
            type="submit"
            className="bg-[#004B94] cursor-pointer text-white font-bold px-6 py-2 rounded hover:bg-blue-800 transition w-full sm:w-auto"
          >
            ➕ Skapa test
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateTest;
