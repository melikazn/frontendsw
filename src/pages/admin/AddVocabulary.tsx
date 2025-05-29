import { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import LevelSelector from "../../components/Selector/LevelSelector";

function AddVocabulary() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    word: "",
    word_class: "",
    article: "",
    forms: "",
    meaning: "",
    synonyms: "",
    translation: "",
    example: "",
    level: ""
  });

  const [error, setError] = useState<string | null>(null);
  const [duplicate, setDuplicate] = useState<any | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitWord = async (force = false) => {
    setError(null);
    try {
      const res = await api.post(`/admin/vocabulary?force=${force}`, {
        ...form,
        forms: form.forms ? form.forms.split(",").map(s => s.trim()) : [],
        synonyms: form.synonyms ? form.synonyms.split(",").map(s => s.trim()) : [],
        first_letter: form.word.charAt(0)
      });

      alert(res.data.message);
      navigate("/admin/vocabulary");
    } catch (err: any) {
      if (err.response?.status === 409 && err.response.data?.existing) {
        setDuplicate(err.response.data.existing[0]);
        setShowConfirmation(true);
      } else {
        setError(err.response?.data?.message || "Något gick fel.");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitWord();
  };

  const inputStyle = "w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const labelStyle = "text-sm font-medium mb-1 block text-gray-700";
  const fieldGroup = "mb-6";

  return (
    <div className="max-w-3xl mx-auto mt-24 mb-20 px-6">
      <h2 className="text-3xl font-bold text-center text-[#004B94] mb-10">➕ Lägg till nytt ord</h2>

      {error && <p className="text-red-600 font-semibold mb-6 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-2xl p-8 space-y-6">
        {[
          { name: "word", label: "Ord", required: true },
          { name: "word_class", label: "Ordklass", required: true },
          { name: "article", label: "Artikel" },
          { name: "forms", label: "Former (kommaseparerade)" },
          { name: "meaning", label: "Mening", required: true },
          { name: "synonyms", label: "Synonymer (kommaseparerade)" },
          { name: "translation", label: "Översättning", required: true },
          { name: "example", label: "Exempel", required: true },
        ].map(({ name, label, required }) => (
          <div key={name} className={fieldGroup}>
            <label className={labelStyle}>{label}:</label>
            <input
              type="text"
              name={name}
              value={(form as any)[name]}
              onChange={handleChange}
              required={required}
              className={inputStyle}
            />
          </div>
        ))}

        <div className={fieldGroup}>
          <label className={labelStyle}>Nivå:</label>
          <LevelSelector
            level={form.level}
            onChange={(lvl) => setForm({ ...form, level: lvl })}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-[#004B94] hover:bg-blue-800 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
          >
            💾 Lägg till ord
          </button>
        </div>
      </form>

      {showConfirmation && duplicate && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 mt-10 p-6 rounded-xl shadow-lg">
          <p className="mb-4 font-semibold">
            ⚠️ Ordet <strong>{duplicate.word}</strong> finns redan. Vill du ändå lägga till det?
          </p>
          <pre className="bg-yellow-50 p-4 text-sm rounded-lg overflow-x-auto">{JSON.stringify(duplicate, null, 2)}</pre>
          <div className="flex gap-4 mt-6 justify-end">
            <button
              onClick={() => submitWord(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded shadow cursor-pointer"
            >
              Ja, lägg till
            </button>
            <button
              onClick={() => setShowConfirmation(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-5 py-2 rounded shadow cursor-pointer"
            >
              Nej
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddVocabulary;