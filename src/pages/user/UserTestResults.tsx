import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../api/axios";
import Dropdown from "../../components/General/Dropdown";
import Pagination from "../../components/General/Pagination";
import Chart from "../../components/General/Chart";
import SearchInput from "../../components/General/SearchInput";
import ResultsTable from "../../components/Test/ResultsTable";

const ITEMS_PER_PAGE = 5;

function UserTestResults() {
  // State för resultat, filter och UI-tillstånd
  const [results, setResults] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);

  // Hämtar alla testresultat vid sidladdning
  useEffect(() => {
    api.get("/users/my-results")
      .then((res) => setResults(res.data.results))
      .catch(() => setError("Kunde inte hämta testresultat"));
  }, []);

  // Filtrerar och sorterar resultat när något filter ändras
  useEffect(() => {
    let filtered = [...results];
    if (statusFilter === "passed") filtered = filtered.filter((r) => r.passed);
    else if (statusFilter === "failed") filtered = filtered.filter((r) => !r.passed);
    if (searchTerm.trim()) {
      filtered = filtered.filter((r) =>
        r.test_title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    filtered.sort((a, b) =>
      sortOrder === "asc"
        ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    setFiltered(filtered);
    setPage(1);
  }, [results, searchTerm, statusFilter, sortOrder]);

  // Beräkna sidvisning
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  // Förbered data till stapeldiagram
  const chartData = paginated.map((r) => ({
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
      {/* Titelbild */}
      <img
        src="/images/results.png"
        alt="Resultat"
        className="mx-auto w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 object-contain mb-6"
        data-aos="flip-left"
      />

      {/* Stapeldiagram */}
      <Chart
        data={chartData}
        xKey="test"
        yKeys={[{ key: "Poäng %", color: "#3b82f6", name: "Poäng %" }]}
      />

      {/* Sökfält */}
      <div className="mb-6">
        <SearchInput
          query={searchTerm}
          onChange={setSearchTerm}
          onSearch={() => {}}
          onClear={() => setSearchTerm("")}
        />
      </div>

      {/* Filtermenyer */}
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

      {/* Felmeddelande om API misslyckas */}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Resultattabell */}
      {paginated.length === 0 ? (
        <p>Inga resultat matchar dina filter.</p>
      ) : (
        <ResultsTable results={paginated} />
      )}

      {/* Sidnavigering */}
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
