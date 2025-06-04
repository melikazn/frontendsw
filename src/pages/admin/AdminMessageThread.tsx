import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { FaTrash, FaArrowLeft, FaPaperPlane } from "react-icons/fa";

function AdminMessageThread() {
  // Hämtar meddelande-id från URL
  const { messageId } = useParams();
  const navigate = useNavigate();

  // Tillstånd för meddelande, svar, nytt svar och felmeddelande
  const [message, setMessage] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [newReply, setNewReply] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Körs vid inladdning för att hämta tråden
  useEffect(() => {
    fetchThread();
  }, [messageId]);

  // Hämtar meddelande och dess svar
  const fetchThread = async () => {
    try {
      const res = await api.get(`/admin/messages/thread/${messageId}`);
      setMessage(res.data.message);
      setReplies(res.data.replies);
    } catch (err) {
      setError("Kunde inte hämta tråden.");
    }
  };

  // Skickar ett nytt svar
  const handleReply = async () => {
    if (!newReply.trim()) return;
    try {
      await api.post(`/admin/messages/thread/${messageId}`, {
        content: newReply,
      });
      setNewReply("");
      fetchThread();
    } catch (err) {
      console.error("❌ Fel vid svar:", err);
    }
  };

  // Raderar hela meddelandet
  const handleDeleteMessage = async () => {
    if (confirm("Är du säker på att du vill ta bort detta meddelande?")) {
      try {
        await api.delete(`/admin/messages/${messageId}`);
        navigate("/admin/messages/my");
      } catch (err) {
        alert("❌ Kunde inte ta bort meddelandet.");
      }
    }
  };

  // Raderar ett enskilt svar i tråden
  const handleDeleteReply = async (replyId: number) => {
    if (confirm("Vill du ta bort detta svar?")) {
      try {
        await api.delete(`/admin/messages/reply/${replyId}`);
        fetchThread();
      } catch (err) {
        alert("❌ Kunde inte ta bort svaret.");
      }
    }
  };

  // Om fel vid hämtning
  if (error) return <p className="text-red-600 text-center">{error}</p>;
  if (!message) return <p className="text-center text-gray-600">Laddar...</p>;

  return (
    <div className="max-w-3xl mt-[120px] mx-auto p-6 bg-white shadow-lg rounded-lg">
      
      {/* Navigering tillbaka och radera meddelande */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigate("/admin/messages/my")}
          className="text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
        >
          <FaArrowLeft /> Tillbaka
        </button>
        <button
          onClick={handleDeleteMessage}
          className="text-red-600 hover:underline cursor-pointer flex items-center gap-1"
        >
          <FaTrash /> Radera meddelande
        </button>
      </div>

      {/* Visar huvudmeddelandet */}
      <h2 className="text-xl font-bold mb-2">
        📩 {message.subject || "(Inget ämne)"}
      </h2>
      <p>
        <strong>Från:</strong>{" "}
        {message.sender_role === "admin" ? "Du (admin)" : message.sender}
      </p>
      <p className="mb-2">
        <strong>Meddelande:</strong> {message.message}
      </p>
      <p className="text-sm text-gray-500">
        Skickat: {new Date(message.created_at).toLocaleString()}
      </p>

      {/* Visar alla svar i tråden */}
      <hr className="my-6" />
      <h3 className="text-lg font-medium mb-4">💬 Tråd</h3>

      {replies.length === 0 ? (
        <p className="text-gray-600">Inga svar ännu.</p>
      ) : (
        <div className="space-y-4">
          {replies.map((reply) => (
            <div
              key={reply.id}
              className={`p-4 rounded-md relative ${
                reply.sender_role === "admin"
                  ? "bg-gray-100 text-gray-800"
                  : "bg-blue-50 text-blue-900"
              }`}
            >
              <p>
                <strong>
                  {reply.sender_role === "admin" ? "Du (admin)" : "Användaren"}:
                </strong>{" "}
                {reply.content}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(reply.created_at).toLocaleString()}
              </p>
              <button
                onClick={() => handleDeleteReply(reply.id)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                title="Radera svar"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Formulär för att skriva nytt svar */}
      <hr className="my-6" />
      <h3 className="text-lg font-medium mb-2">✏️ Svara</h3>
      <textarea
        value={newReply}
        onChange={(e) => setNewReply(e.target.value)}
        rows={4}
        placeholder="Skriv ditt svar här..."
        className="w-full border border-gray-300 rounded p-3 mb-4"
      />
      <button
        onClick={handleReply}
        className="bg-blue-600 text-white px-4 py-2 cursor-pointer rounded hover:bg-blue-700 flex items-center gap-2"
      >
        <FaPaperPlane /> Skicka svar
      </button>
    </div>
  );
}

export default AdminMessageThread;
