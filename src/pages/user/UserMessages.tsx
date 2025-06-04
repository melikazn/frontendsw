import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { motion } from "framer-motion";
import MessageListItem from "../../components/Messages/MessageListItem";
import Pagination from "../../components/General/Pagination";
import SearchInput from "../../components/General/SearchInput";
import Dropdown from "../../components/General/Dropdown";

function UserMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<any[]>([]); 
  const [filterBySender, setFilterBySender] = useState("all"); 
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1); 
  const ITEMS_PER_PAGE = 5; 
  const navigate = useNavigate();

  // Hämta meddelanden vid inladdning
  useEffect(() => {
    fetchMessages();
  }, []);

  // Filtrera vid ändring
  useEffect(() => {
    applyFilter();
  }, [messages, filterBySender, searchTerm]);

  // API-anrop + sortering
  const fetchMessages = async () => {
    try {
      const res = await api.get("/users/messages");
      const sorted = res.data.sort(
        (a: any, b: any) =>
          new Date(b.latest_activity).getTime() - new Date(a.latest_activity).getTime()
      );
      setMessages(sorted);
    } catch (err) {
      setError("Kunde inte hämta dina meddelanden.");
    }
  };

  // Filtrera avsändare + sökning
  const applyFilter = () => {
    let result = [...messages];

    if (filterBySender === "admin") {
      result = result.filter((m) => m.sender_role === "admin");
    } else if (filterBySender === "user") {
      result = result.filter((m) => m.sender_role !== "admin");
    }

    if (searchTerm.trim() !== "") {
      result = result.filter((m) =>
        m.subject?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setPage(1);
    setFilteredMessages(result);
  };

  // Sidindelning
  const paginated = filteredMessages.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(filteredMessages.length / ITEMS_PER_PAGE);

  return (
    <motion.div
      className="w-full max-w-screen-lg mx-auto px-4 py-12 mt-[100px] text-[#00296b]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Tillbaka-knapp */}
      <button
        onClick={() => navigate("/dashboard/messages")}
        className="mb-8 px-4 py-2 bg-blue-600 text-white cursor-pointer rounded hover:bg-blue-500 transition font-medium"
      >
        ⬅ Tillbaka till meddelanden
      </button>

      <h2 className="text-3xl font-bold mb-6">📬 Dina meddelanden</h2>

      {/* Sökfält */}
      <div className="mb-6">
        <SearchInput
          query={searchTerm}
          onChange={setSearchTerm}
          onSearch={() => {}}
          onClear={() => setSearchTerm("")}
        />
      </div>

      {/* Dropdown-filter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Dropdown
          label="Avsändare"
          selected={filterBySender}
          onChange={setFilterBySender}
          options={[
            { label: "Alla", value: "all" },
            { label: "Endast admin", value: "admin" },
            { label: "Endast användare", value: "user" },
          ]}
        />
      </div>

      {/* Felmeddelande */}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Lista eller tomt meddelande */}
      {paginated.length === 0 ? (
        <p>Inga meddelanden matchar filtret.</p>
      ) : (
        <ul className="space-y-5">
          {paginated.map((m, index) => (
            <MessageListItem
              key={m.id}
              message={m}
              onClick={() => navigate(`/dashboard/messages/thread/${m.id}`)}
              delay={index * 0.05}
            />
          ))}
        </ul>
      )}

      {/* Paginering */}
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

export default UserMessages;
