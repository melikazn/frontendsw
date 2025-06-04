import { useState } from "react";
import api from "../../api/axios";

// Komponent för att lägga till en ny kategori
function AddCategory() {
  const [name, setName] = useState("");
  const [level, setLevel] = useState("A1");
  const [message, setMessage] = useState<string | null>(null);

    // Skicka formuläret
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/admin/categories", { name, level });
      setMessage(res.data.message || "Kategori skapades.");
      setName("");
      setLevel("A1");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "❌ Något gick fel.");
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 max-w-xl mx-auto mt-[120px] mb-[300px]">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#004B94] mb-6 text-center">
        ➕ Skapa ny kategori
      </h2>

      {message && (
        <p className="mb-4 text-sm font-medium text-center text-blue-800 bg-blue-100 px-4 py-2 rounded shadow">
          {message}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 sm:p-8 space-y-5"
      >
        <div>
          <label className="block text-sm font-semibold mb-1">
            Kategorinamn:
          </label>
          <input
            type="text"
            value={name}
            placeholder="T.ex. Grammatik"
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-[#004B94] cursor-pointer text-white font-bold px-6 py-2 rounded hover:bg-blue-800 transition w-full sm:w-auto"
          >
            💾 Skapa kategori
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddCategory;
