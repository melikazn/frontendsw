import { motion } from "framer-motion";

// Props: ett meddelande, klickfunktion och animationsfördröjning
interface Props {
  message: any;
  onClick: () => void;
  delay?: number;
}

// Visar ett meddelande i listan, med animation och klickbar routing
const MessageListItem = ({ message, onClick, delay = 0 }: Props) => {
  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className={`p-5 rounded-md shadow border cursor-pointer transition hover:bg-gray-50 ${
        message.sender_role === "admin" ? "bg-blue-50" : "bg-white"
      }`}
    >
      {/* Ämnesrad */}
      <p className="text-blue-700 font-semibold text-lg">
        📌 Ämne: {message.subject || "(Inget ämne)"}
      </p>

      {/* Avsändartyp */}
      <p className="mt-1 text-base">
        <strong>Typ:</strong>{" "}
        {message.sender_role === "admin"
          ? "📊 Meddelande från Admin"
          : "📖 Du har skickat meddelanden"}
      </p>

      {/* Datum för senaste aktivitet */}
      <p className="text-sm text-gray-500 mt-1">
        📅 {new Date(message.latest_activity).toLocaleString()}
      </p>
    </motion.li>
  );
};

export default MessageListItem;
