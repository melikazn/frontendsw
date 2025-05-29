import { useEffect, useState } from "react";
import api from "../api/axios";

function AdminMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [replies, setReplies] = useState<{ [key: number]: string }>({});
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await api.get("/admin/messages");
      setMessages(res.data);
    } catch {
      setFeedback("❌ Kunde inte hämta meddelanden.");
    }
  };

  const handleReply = async (id: number) => {
    const reply = replies[id];
    if (!reply?.trim()) return;

    try {
      await api.post(`/admin/messages/${id}/reply`, { reply });
      setReplies((prev) => ({ ...prev, [id]: "" }));
      fetchMessages();
    } catch {
      setFeedback("❌ Kunde inte skicka svaret.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-[#004B94] mb-6">📨 KOSKESH Privata meddelanden från användare</h2>
      {feedback && (
        <div className="bg-red-100 text-red-800 px-4 py-2 rounded mb-4">{feedback}</div>
      )}

      {messages.length === 0 ? (
        <p className="text-gray-600">Inga meddelanden ännu.</p>
      ) : (
        <ul className="space-y-6">
          {messages.map((msg) => (
            <li
              key={msg.id}
              className="border border-gray-300 rounded-lg p-5 bg-white shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-semibold text-blue-900">
                  📌 {msg.subject}
                </h4>
                {msg.answered && (
                  <span className="text-green-600 font-medium text-sm">✔️ Besvarat</span>
                )}
              </div>

              <p className="text-sm text-gray-700">
                <strong>Från:</strong> {msg.sender}
              </p>
              <p className="my-2 text-gray-800">
                <strong>Meddelande:</strong><br />
                {msg.message}
              </p>
              <p className="text-xs text-gray-500 italic">
                🕒 {new Date(msg.created_at).toLocaleString()}
              </p>

              {msg.answered && msg.admin_reply ? (
                <div className="bg-gray-100 p-3 mt-4 rounded">
                  <strong className="text-sm text-gray-700">Svar från admin:</strong>
                  <p className="text-gray-800 mt-1">{msg.admin_reply}</p>
                </div>
              ) : (
                <div className="mt-4">
                  <textarea
                    rows={3}
                    placeholder="Skriv ett svar..."
                    value={replies[msg.id] || ""}
                    onChange={(e) =>
                      setReplies((prev) => ({ ...prev, [msg.id]: e.target.value }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded mb-2"
                  />
                  <button
                    onClick={() => handleReply(msg.id)}
                    className="bg-blue-700 text-white px-4 py-2 cursor-pointer rounded hover:bg-blue-800"
                  >
                    ✉️ Skicka svar
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminMessages;
