import { useNavigate } from "react-router-dom";

// Adminsida för att hantera meddelanden
function AdminMessages() {
  const navigate = useNavigate();

  return (
    <div className="max-w-xl mx-auto mt-[200px] px-6 py-10 bg-white shadow-md mb-[200px] rounded-lg">
      <h2 className="text-2xl font-bold text-[#004B94] mb-4">✉️ Adminmeddelanden</h2>

      {/* Navigeringsknappar */}
      <div className="flex flex-col gap-4">
        <button
          onClick={() => navigate("/admin/messages/send-global")}
          className="bg-blue-700 text-white py-3 px-6 rounded hover:bg-blue-800 text-left cursor-pointer flex items-center gap-2"
        >
          📢 <span>Skicka meddelande</span>
        </button>

        <button
          onClick={() => navigate("/admin/messages/my")}
          className="bg-yellow-300 text-blue-700 py-3 px-6 rounded hover:bg-yellow-200 text-left cursor-pointer flex items-center gap-2"
        >
          📜 <span>Se mottagna privata meddelanden</span>
        </button>
      </div>
    </div>
  );
}

export default AdminMessages;
