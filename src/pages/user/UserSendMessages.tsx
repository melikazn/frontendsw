import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SendMessageForm from "../../components/Messages/SendMessageForm";

function UserSendMessage() {
  // Tillstånd för formulärfält och status
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Hanterar formulärinlämning
  const handleSubmit = async () => {
    if (!message.trim()) {
      setStatus("Meddelandet får inte vara tomt.");
      return;
    }

    setLoading(true);
    try {
      // Laddar API-modulen dynamiskt och skickar meddelandet
      const { default: api } = await import("../../api/axios");
      await api.post("/users/messages", { subject, message });
      setStatus("✅ Meddelandet har skickats till admin.");
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error("Fel vid skickande av meddelande:", error);
      setStatus("❌ Det gick inte att skicka meddelandet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Formulär med animation
    <motion.div
      className="w-full max-w-screen-md mx-auto px-4 sm:px-6 py-12 mt-[100px] text-[#00296b]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Återanvänd komponent för formulär */}
      <SendMessageForm
        subject={subject}
        setSubject={setSubject}
        message={message}
        setMessage={setMessage}
        onSubmit={handleSubmit}
        loading={loading}
        status={status}
        onBack={() => navigate("/dashboard/messages")}
      />
    </motion.div>
  );
}

export default UserSendMessage;
