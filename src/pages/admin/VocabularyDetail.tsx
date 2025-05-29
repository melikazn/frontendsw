import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";

function VocabularyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [wordData, setWordData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchWord();
  }, [id]);

  const fetchWord = async () => {
    try {
      const res = await api.get(`/admin/vocabulary/${id}`);
      setWordData(res.data);
    } catch (err) {
      console.error("Fel vid hämtning av ord:", err);
      setError("Kunde inte hämta ordet");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setWordData({ ...wordData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await api.put(`/admin/vocabulary/${id}`, wordData);
      setSuccess("✅ Ändringar sparade!");
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      console.error("Fel vid uppdatering:", err);
      setError("❌ Kunde inte spara ändringar.");
    }
  };

  if (!wordData) return <p className="text-center mt-10">Laddar...</p>;

  const inputStyle = "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400";
  const labelStyle = "text-sm font-semibold text-left mb-1";
  const fieldGroup = "mb-5";

  return (
    <div className="max-w-2xl mx-auto mt-[100px] mb-20 px-4">
      <h2 className="text-2xl font-bold text-[#004B94] mb-6">✏️ Redigera ord: <span className="text-blue-800">{wordData.word}</span></h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      <div className="bg-white shadow-md rounded-xl p-6 space-y-5">
        {[
          { name: "word", label: "Ord", type: "input" },
          { name: "word_class", label: "Ordklass", type: "input" },
          { name: "forms", label: "Former", type: "input" },
          { name: "meaning", label: "Mening", type: "textarea" },
          { name: "synonyms", label: "Synonymer", type: "input" },
          { name: "translation", label: "Översättning", type: "input" },
          { name: "example", label: "Exempel", type: "textarea" },
        ].map((field) => (
          <div className={fieldGroup} key={field.name}>
            <label className={labelStyle}>{field.label}:</label>
            {field.type === "input" ? (
              <input
                name={field.name}
                value={wordData[field.name] || ""}
                onChange={handleChange}
                className={inputStyle}
              />
            ) : (
              <textarea
                name={field.name}
                value={wordData[field.name] || ""}
                onChange={handleChange}
                className={`${inputStyle} min-h-[100px]`}
              />
            )}
          </div>
        ))}

        <div className={fieldGroup}>
          <label className={labelStyle}>Nivå:</label>
          <select
            name="level"
            value={wordData.level || ""}
            onChange={handleChange}
            className={inputStyle}
          >
            <option value="">Välj nivå</option>
            <option value="A1">A1</option>
            <option value="A2">A2</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
            <option value="C1">C1</option>
          </select>
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={() => navigate(-1)}
            className="px-4 cursor-pointer py-2 bg-gray-300 text-[#00296b] rounded hover:bg-gray-400"
          >
            ⬅ Tillbaka
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 cursor-pointer bg-[#004B94] text-white rounded hover:bg-blue-800 font-bold"
          >
            💾 Spara ändringar
          </button>
        </div>
      </div>
    </div>
  );
}

export default VocabularyDetail;
