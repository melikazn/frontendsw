import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../api/axios";
import resultsImage from "/images/results.png";
import Dropdown from "../../components/General/Dropdown";
import Pagination from "../../components/General/Pagination";
import Chart from "../../components/General/Chart";
import SearchInput from "../../components/General/SearchInput";

function UserTestResults() {
  const [results, setResults] = useState<any[]>([]);
  const [filteredResults, setFilteredResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchResults();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [results, searchTerm, statusFilter, sortOrder]);

  const fetchResults = async () => {
    try {
      const res = await api.get("/users/my-results");
      setResults(res.data.results);
    } catch (err) {
      console.error("Fel vid hämtning av resultat", err);
      setError("Kunde inte hämta testresultat");
    }
  };

  const applyFilters = () => {
    let filtered = [...results];

    if (statusFilter === "passed") {
      filtered = filtered.filter((r) => r.passed);
    } else if (statusFilter === "failed") {
      filtered = filtered.filter((r) => !r.passed);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter((r) =>
        r.test_title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setFilteredResults(filtered);
    setPage(1);
  };

  const paginated = filteredResults.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE);

  const chartData = results.map((r) => ({
    test: r.test_title,
    "Poäng %": r.total_questions
      ? Math.round((r.correct_answers / r.total_questions) * 100)
      : 0,
  }));

  return (
    <motion.div
      className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 py-10 mt-[100px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <img
        src={resultsImage}
        alt="Resultat"
        className="mx-auto w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 object-contain mb-6"
        data-aos="flip-left"
      />

      <Chart
        data={chartData}
        xKey="test"
        yKeys={[{ key: "Poäng %", color: "#3b82f6", name: "Poäng %" }]}
      />

      {/* Sökfält + filter */}
      <div className="mb-6">
        <SearchInput
          query={searchTerm}
          onChange={setSearchTerm}
          onSearch={() => {}}
          onClear={() => setSearchTerm("")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Dropdown
          label="Resultat"
          selected={statusFilter}
          onChange={setStatusFilter}
          options={[
            { label: "Alla resultat", value: "all" },
            { label: "Endast godkända", value: "passed" },
            { label: "Endast ej godkända", value: "failed" },
          ]}
        />

        <Dropdown
          label="Sortering"
          selected={sortOrder}
          onChange={setSortOrder}
          options={[
            { label: "Nyast först", value: "desc" },
            { label: "Äldst först", value: "asc" },
          ]}
        />
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {paginated.length === 0 ? (
        <p>Inga resultat matchar dina filter.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border-b p-2">Test</th>
                <th className="border-b p-2">Poäng</th>
                <th className="border-b p-2">Krav</th>
                <th className="border-b p-2">Tid</th>
                <th className="border-b p-2">Status</th>
                <th className="border-b p-2">Datum</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((r, index) => {
                const requiredCorrect = Math.ceil(r.total_questions * 0.7);
                return (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="p-2">{r.test_title}</td>
                    <td className="p-2">
                      {r.correct_answers} / {r.total_questions}
                    </td>
                    <td className="p-2">Minst {requiredCorrect} rätt</td>
                    <td className="p-2">{r.duration_formatted || "–"}</td>
                    <td
                      className={`p-2 font-semibold ${
                        r.passed ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {r.passed ? "✅ Godkänd" : "❌ Ej godkänd"}
                    </td>
                    <td className="p-2">
                      {new Date(r.created_at).toLocaleString()}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onNext={() => setPage((p) => Math.min(p + 1, totalPages))}
          onPrev={() => setPage((p) => Math.max(p - 1, 1))}
        />
      )}
    </motion.div>
  );
}

export default UserTestResults;
