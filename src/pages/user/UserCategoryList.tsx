import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { motion } from "framer-motion";
import CategorySelector from "../../components/Selector/CategorySelector";

function UserCategoryList() {
  const navigate = useNavigate();
  const { level } = useParams(); // Hämtar språknivå från URL
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Hämtar kategorier vid sidladdning
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/users/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Fel vid hämtning av kategorier", err);
      setError("Kunde inte hämta kategorier");
    }
  };

  // Navigerar till sektioner för vald kategori
  const handleSelect = (categoryId: number) => {
    setSelectedId(categoryId);
    navigate(`/dashboard/tests/${level}/${categoryId}/sections`);
  };

  return (
    <motion.div
      className="max-w-screen-xl mx-auto px-4 py-16 mt-[100px] text-[#00296b]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Tillbaka-knapp */}
      <motion.button
        onClick={() => navigate("/dashboard/tests")}
        className="mb-8 bg-blue-600 cursor-pointer hover:bg-blue-500 text-white font-medium py-2 px-5 rounded-md transition"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ⬅ Tillbaka till nivåval
      </motion.button>

      {/* Rubrik */}
      <motion.h2
        className="text-3xl sm:text-4xl font-bold mb-10 text-center sm:text-left"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        📁 Alla kategorier för nivå {level}
      </motion.h2>

      {/* Felmeddelande */}
      {error && <p className="text-red-600 mb-6">{error}</p>}

      {/* Lista över kategorier */}
      <CategorySelector
        categories={categories}
        onSelect={handleSelect}
        selectedId={selectedId}
      />
    </motion.div>
  );
}

export default UserCategoryList;
