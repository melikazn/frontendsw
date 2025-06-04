import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { motion } from "framer-motion";
import SectionSelector from "../../components/Selector/SectionSelector";

function UserSectionList() {
  // Hämtar route-parametrar (kategori-id och nivå)
  const { id, level } = useParams();
  const navigate = useNavigate();

  // Tillstånd för sektioner och eventuella fel
  const [sections, setSections] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Hämtar sektioner varje gång id eller nivå ändras
  useEffect(() => {
    fetchSections();
  }, [id, level]);

  // Hämtar sektioner och tillhörande test för varje sektion
  const fetchSections = async () => {
    try {
      const res = await api.get("/users/sections/by-category", {
        params: { categoryId: id, level },
      });

      const sectionsWithTests = await Promise.all(
        res.data.map(async (section: any) => {
          const testRes = await api.get(`/users/sections/${section.id}/tests`);
          return { ...section, tests: testRes.data };
        })
      );

      setSections(sectionsWithTests);
    } catch (err) {
      console.error("Fel vid hämtning av sektioner", err);
      setError("Kunde inte hämta sektioner");
    }
  };

  // Hanterar val av sektion (för framtida funktionalitet)
  const handleSelectSection = (sectionId: number) => {
    console.log("Vald sektion:", sectionId);
  };

  return (
    <motion.div
      className="max-w-screen-xl mx-auto px-4 py-16 mt-[100px] text-[#00296b]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Tillbaka-knapp */}
      <motion.button
        onClick={() => navigate(`/dashboard/tests/${level}`)}
        className="mb-8 bg-blue-600 cursor-pointer hover:bg-blue-500 text-white font-medium py-2 px-5 rounded-md transition"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ⬅ Tillbaka till kategorier
      </motion.button>

      {/* Rubrik */}
      <h2 className="text-3xl sm:text-4xl font-bold mb-10 text-center sm:text-left">
        📂 Sektioner för nivå {level}
      </h2>

      {/* Felmeddelande om något går fel */}
      {error && <p className="text-red-600 mb-6">{error}</p>}

      {/* Visar sektioner med tillhörande tester */}
      <SectionSelector
        sections={sections}
        onStartTest={(testId) => navigate(`/dashboard/tests/${testId}/start`)}
        onSelectSection={handleSelectSection}
      />
    </motion.div>
  );
}

export default UserSectionList;
