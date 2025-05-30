import { motion } from "framer-motion";

// Typdefinition för ett enskilt svar i tråden
interface Reply {
  id: string;
  sender_role: string;
  content: string;
  created_at: string;
}

// Props: en array med svar
interface Props {
  replies: Reply[];
}

// Komponent som visar en lista av svar i en meddelandetråd
const MessageReplyThread = ({ replies }: Props) => {
  // Om inga svar finns, visa meddelande
  if (replies.length === 0) {
    return <p className="text-gray-500 text-base">Inga svar ännu.</p>;
  }

  return (
    <ul className="space-y-5">
      {replies.map((r) => (
        <motion.li
          key={r.id}
          // Färg beroende på avsändarroll
          className={`p-4 rounded-md shadow-sm flex flex-col sm:flex-row sm:items-start gap-3 ${
            r.sender_role === "admin"
              ? "bg-blue-50 border border-blue-200"
              : "bg-yellow-50 border border-yellow-200"
          }`}

          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-base break-words">
            {/* Visar avsändare och innehåll */}
            <p className="mb-1">
              <strong>{r.sender_role === "admin" ? "Läraren" : "Du"}:</strong> {r.content}
            </p>
            {/* Tidsstämpel */}
            <p className="text-xs text-gray-500">
              🗓 {new Date(r.created_at).toLocaleString()}
            </p>
          </div>
        </motion.li>
      ))}
    </ul>
  );
};

export default MessageReplyThread;
