import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import MessageReplyThread from "../../components/Messages/MessageReplyThread";
import ReplyInput from "../../components/Messages/ReplyInput";

function UserMessageThread() {
  // Hämtar meddelande-ID från URL
  const { messageId } = useParams();
  const navigate = useNavigate();

  // State för meddelandet, svar, formulär, fel och bekräftelse
  const [message, setMessage] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [newReply, setNewReply] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Hämta tråden när komponenten laddas eller messageId ändras
  useEffect(() => {
    fetchThread();
  }, [messageId]);

  // API-anrop för att hämta meddelande och dess svar
  const fetchThread = async () => {
    try {
      const res = await api.get(`/users/messages/thread/${messageId}`);
      setMessage(res.data.message);

      // Om det inte finns några replies men ett admin-svar, skapa ett inledande svar manuellt
      setReplies(
        res.data.replies.length === 0 && res.data.message.admin_reply
          ? [
              {
                id: "admin-initial",
                sender_role: "admin",
                content: res.data.message.admin_reply,
                created_at: res.data.message.created_at,
              },
            ]
          : res.data.replies
      );

      setError(null);
    } catch {
      setError("Kunde inte hämta tråden.");
    }
  };

  // Skicka nytt svar
  const handleSubmit = async () => {
    if (!newReply.trim()) return;

    try {
      await api.post(`/users/messages/thread/${messageId}`, {
        content: newReply,
      });

      setNewReply("");
      setSuccess("✅ Ditt svar har skickats.");
      fetchThread(); // Uppdatera tråden efter inlägg
    } catch {
      setError("Det gick inte att skicka svaret.");
    }
  };

  // Felmeddelande eller laddar-indikator
  if (error) return <p className="text-red-600 text-center mt-10">{error}</p>;
  if (!message) return <p className="text-center mt-10">🔄 Laddar meddelande...</p>;

  return (
    <div className="w-full max-w-screen-md mx-auto px-4 sm:px-6 py-12 mt-[100px] text-[#00296b]">
      {/* Tillbaka-knapp */}
      <button
        onClick={() => navigate("/dashboard/messages/list")}
        className="mb-8 cursor-pointer bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-md transition w-full sm:w-auto"
      >
        ⬅ Tillbaka till meddelanden
      </button>

      {/* Huvudmeddelande */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 break-words">
        📨 Meddelande: {message.subject || "(Inget ämne)"}
      </h2>

      <p className="mb-2 text-base break-words">
        <strong>{message.sender_role === "admin" ? "Läraren" : "Du"}:</strong>{" "}
        {message.message}
      </p>
      <p className="text-sm text-gray-500 mb-6">
        📅 {new Date(message.created_at).toLocaleString()}
      </p>

      {/* Svarstråd */}
      <hr className="mb-8" />
      <h3 className="text-xl font-semibold mb-4">💬 Tråd</h3>
      <MessageReplyThread replies={replies} />

      {/* Svarsfält */}
      <hr className="my-10" />
      <ReplyInput
        newReply={newReply}
        setNewReply={setNewReply}
        onSubmit={handleSubmit}
      />

      {/* Bekräftelse */}
      {success && <p className="text-green-600 mt-5 text-base">{success}</p>}
    </div>
  );
}

export default UserMessageThread;
