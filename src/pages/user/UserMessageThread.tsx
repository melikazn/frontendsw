import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../api/axios";
import MessageReplyThread from "../../components/Messages/MessageReplyThread";
import ReplyInput from "../../components/Messages/ReplyInput";

function UserMessageThread() {
  const { messageId } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [newReply, setNewReply] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchThread();
  }, [messageId]);

  const fetchThread = async () => {
    try {
      const res = await api.get(`/users/messages/thread/${messageId}`);
      setMessage(res.data.message);
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

  const handleSubmit = async () => {
    if (!newReply.trim()) return;

    try {
      await api.post(`/users/messages/thread/${messageId}`, {
        content: newReply,
      });
      setNewReply("");
      setSuccess("✅ Ditt svar har skickats.");
      fetchThread();
    } catch {
      setError("Det gick inte att skicka svaret.");
    }
  };

  if (error) return <p className="text-red-600 text-center mt-10">{error}</p>;
  if (!message) return <p className="text-center mt-10">🔄 Laddar meddelande...</p>;

  return (
    <div className="w-full max-w-screen-md mx-auto px-4 sm:px-6 py-12 mt-[100px] text-[#00296b]">
      <button
        onClick={() => navigate("/dashboard/messages/list")}
        className="mb-8 cursor-pointer bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-md transition w-full sm:w-auto"
      >
        ⬅ Tillbaka till meddelanden
      </button>

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

      <hr className="mb-8" />
      <h3 className="text-xl font-semibold mb-4">💬 Tråd</h3>

      <MessageReplyThread replies={replies} />

      <hr className="my-10" />

      <ReplyInput
        newReply={newReply}
        setNewReply={setNewReply}
        onSubmit={handleSubmit}
      />

      {success && <p className="text-green-600 mt-5 text-base">{success}</p>}
    </div>
  );
}

export default UserMessageThread;
