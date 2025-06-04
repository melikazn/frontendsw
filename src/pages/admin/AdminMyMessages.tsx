import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/General/Pagination";

// Admin-komponent för att visa inkommande privata meddelanden
function AdminMyMessages() {
  const [messages, setMessages] = useState<any[]>([]); 
  const [error, setError] = useState<string | null>(null); 
  const [currentPage, setCurrentPage] = useState(1); 
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // Hämtar meddelanden vid inladdning
  useEffect(() => {
    fetchMessages();
  }, []);

  // API-anrop för att hämta meddelanden
  const fetchMessages = async () => {
    try {
      const res = await api.get("/admin/messages");
      setMessages(res.data);
    } catch (err) {
      setError("Kunde inte hämta meddelanden.");
    }
  };

  // Paginerar listan
  const totalPages = Math.ceil(messages.length / itemsPerPage);
  const currentMessages = messages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-3xl mt-[100px] mx-auto p-6 bg-white rounded-xl shadow">
      {/* Tillbaka-knapp */}
      <button
        onClick={() => navigate("/admin/messages")}
        className="text-blue-600 cursor-pointer hover:underline mb-4"
      >
        ⬅️ Tillbaka
      </button>

      <h2 className="text-2xl font-bold mb-4">📩 Inkommande meddelanden</h2>

      {/* Felmeddelande */}
      {error && <p className="text-red-600">{error}</p>}

      {/* Visar meddelandelistan */}
      {messages.length === 0 ? (
        <p>Inga meddelanden ännu.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {currentMessages.map((msg) => (
            <li key={msg.id} className="py-4">
              <p className="font-medium">
                🔖 Ämne:{" "}
                <span
                  onClick={() => navigate(`/admin/messages/thread/${msg.id}`)}
                  className="text-blue-600 hover:underline cursor-pointer"
                >
                  {msg.subject || "(Inget ämne)"}
                </span>
              </p>
              <p>👤 Från: {msg.sender}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Paginering */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          onPrev={() => setCurrentPage((p) => Math.max(p - 1, 1))}
        />
      )}
    </div>
  );
}

export default AdminMyMessages;
