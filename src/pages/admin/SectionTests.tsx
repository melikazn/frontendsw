import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Pagination from "../../components/General/Pagination";
import LevelSelector from "../../components/Selector/LevelSelector";

function SectionTests() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tests, setTests] = useState<any[]>([]);
  const [levelFilter, setLevelFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [editTestId, setEditTestId] = useState<number | null>(null);
  const [editData, setEditData] = useState({ title: "", level: "" });

  useEffect(() => {
    if (!id) return;
    const fetchTests = async () => {
      try {
        const res = await api.get(`/admin/sections/${id}/tests`);
        setTests(res.data);
      } catch (err) {
        console.error("Fel vid hämtning av tester:", err);
      }
    };
    fetchTests();
  }, [id]);

  const filteredTests = levelFilter
    ? tests.filter((test) => test.level === levelFilter)
    : tests;
  const totalPages = Math.ceil(filteredTests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTests = filteredTests.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = async (testId: number) => {
    if (!window.confirm("Är du säker på att du vill ta bort testet?")) return;
    try {
      await api.delete(`/admin/tests/${testId}`);
      setTests((prev) => prev.filter((t) => t.id !== testId));
    } catch (err) {
      console.error("Fel vid borttagning:", err);
    }
  };

  const handleEditClick = (test: any) => {
    setEditTestId(test.id);
    setEditData({ title: test.title, level: test.level });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async (testId: number) => {
    try {
      await api.put(`/admin/tests/${testId}`, editData);
      setTests((prev) =>
        prev.map((t) => (t.id === testId ? { ...t, ...editData } : t))
      );
      setEditTestId(null);
    } catch (err) {
      console.error("Kunde inte spara ändringar:", err);
    }
  };

  return (
    <main className="max-w-6xl mt-[100px] mx-auto px-4 py-10 text-[#00296b]">
      <button
        onClick={() => navigate("/admin/sections")}
        className="mb-6 text-sm text-blue-700 cursor-pointer underline hover:text-blue-900"
      >
        ← Tillbaka till sektioner
      </button>

      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
        🧪 Tester för sektion {id}
      </h2>

      <div className="flex justify-end mb-6">
        <LevelSelector level={levelFilter} onChange={setLevelFilter} />
      </div>

      <ul className="space-y-4 mb-6">
        {currentTests.map((test) => (
          <li
            key={test.id}
            className="bg-white border p-4 rounded shadow-sm flex flex-col gap-4"
          >
            <div className="flex justify-between items-center flex-wrap gap-4">
              {editTestId === test.id ? (
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <input
                    type="text"
                    name="title"
                    value={editData.title}
                    onChange={handleEditChange}
                    className="border px-3 py-2 rounded w-full sm:w-auto"
                  />
                  <LevelSelector
                    level={editData.level}
                    onChange={(lvl) => setEditData({ ...editData, level: lvl })}
                    showAllOption={false}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave(test.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
                    >
                      💾 Spara
                    </button>
                    <button
                      onClick={() => setEditTestId(null)}
                      className="text-sm text-gray-600 underline cursor-pointer"
                    >
                      ❌ Avbryt
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <p className="font-semibold text-lg">{test.title}</p>
                    <p className="text-sm text-gray-600">Nivå: {test.level}</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => handleEditClick(test)}
                      className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-300 cursor-pointer"
                    >
                      ✏️ Redigera
                    </button>
                    <button
                      onClick={() => handleDelete(test.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer"
                    >
                      🗑 Ta bort
                    </button>
                    <button
                      onClick={() => navigate(`/admin/tests/${test.id}/questions`)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 cursor-pointer"
                    >
                      ❓ Frågor
                    </button>
                  </div>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          onPrev={() => setCurrentPage((p) => Math.max(p - 1, 1))}
        />
      )}
    </main>
  );
}

export default SectionTests;
