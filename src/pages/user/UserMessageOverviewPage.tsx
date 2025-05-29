// 📁 src/pages/user/UserMessageOverviewPage.tsx
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import messageImage from "/images/sendmail.png";

function UserMessageOverviewPage() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto mt-[100px] px-4 sm:px-6 py-12 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >


      <motion.img
        src={messageImage}
        alt="Meddelande"
        className="mx-auto w-28 h-28 sm:w-40 sm:h-40 md:w-48 md:h-48 object-contain mb-8"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      />

      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/dashboard/messages/send")}
          className="w-full sm:w-auto cursor-pointer bg-yellow-400 hover:bg-yellow-300 text-[#00296b] font-semibold py-3 px-6 rounded-xl shadow-md transition duration-200"
        >
          ✏️ Skicka meddelande till läraren
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/dashboard/messages/list")}
          className="w-full sm:w-auto bg-blue-500 cursor-pointer hover:bg-blue-400 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition duration-200"
        >
          📬 Se mina meddelanden
        </motion.button>
      </div>
    </motion.div>
  );
}

export default UserMessageOverviewPage;
