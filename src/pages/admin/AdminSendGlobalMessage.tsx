import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import Dropdown from "../../components/General/Dropdown";

function AdminSendGlobalMessage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [recipientId, setRecipientId] = useState("all");
  const [status, setStatus] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Kunde inte hämta användare.");
    }
  };

  const handleSend = async () => {
    if (!message.trim()) {
      setStatus("Meddelande krävs.");
      return;
    }

    try {
      if (recipientId === "all") {
        await api.post("/admin/global-message", {
          title: subject.trim(),
          message: message.trim(),
        });
        setStatus("✅ Meddelande skickat till alla användare!");
      } else {
        await api.post("/admin/private-message", {
          userId: recipientId,
          subject: subject.trim(),
          message: message.trim(),
        });
        setStatus("✅ Meddelande skickat till vald användare!");
      }

      setMessage("");
      setSubject("");
      setRecipientId("all");
    } catch (err) {
      setStatus("❌ Det gick inte att skicka meddelandet.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white mt-[100px] rounded-xl shadow-md ">
      <button
        onClick={() => navigate("/admin/messages")}
        className="text-blue-600 cursor-pointer hover:underline mb-4"
      >
        ⬅️ Tillbaka till meddelanden
      </button>

      <h2 className="text-2xl font-semibold mb-6">✉️ Skicka meddelande</h2>

      <div className="mb-4">
        <label className="block font-medium mb-1">Mottagare:</label>
        <Dropdown
          selected={recipientId}
          onChange={setRecipientId}
          options={[
            { label: "📢 Alla användare", value: "all" },
            ...users.map((u) => ({
              label: `👤 ${u.name} (${u.email})`,
              value: u.id.toString(),
            })),
          ]}
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Ämne:</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Meddelande:</label>
        <textarea
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Skriv meddelandet här..."
          className="w-full border border-gray-300 rounded px-3 py-2"
        ></textarea>
      </div>

      <button
        onClick={handleSend}
        className="bg-blue-600 text-white px-4 cursor-pointer py-2 rounded hover:bg-blue-700 transition"
      >
        📤 Skicka
      </button>

      {status && (
        <p
          className={`mt-4 ${
            status.includes("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {status}
        </p>
      )}
    </div>
  );
}

export default AdminSendGlobalMessage;
