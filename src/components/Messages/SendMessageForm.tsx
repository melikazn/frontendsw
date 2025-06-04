
interface Props {
  subject: string;
  setSubject: (val: string) => void;
  message: string;
  setMessage: (val: string) => void;
  onSubmit: () => void;
  loading: boolean;
  status: string | null;
  onBack?: () => void;
}


// Formulär för att skicka ett nytt meddelande till admin
const SendMessageForm = ({
  subject,
  setSubject,
  message,
  setMessage,
  onSubmit,
  loading,
  status,
}: Props) => {
  return (
    <div className="bg-white rounded-lg shadow px-6 sm:px-10 py-8">
      {/* Titel */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">
        📨 Skicka meddelande till admin
      </h2>

      {/* Ämnesfält */}
      <label className="block mb-1 font-medium text-base">Ämne :</label>
      <input
        type="text"
        value={subject}
        onChange={(e) => setSubject(e.target.value)} 
        className="w-full mb-5 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
      />

      {/* Meddelandefält */}
      <label className="block mb-1 font-medium text-base">Meddelande:</label>
      <textarea
        rows={6}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Skriv ditt meddelande här..."
        className="w-full mb-5 border border-gray-300 rounded px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
      />

      {/* Skicka-knapp*/}
      <button
        onClick={onSubmit}
        disabled={loading}
        className="w-full sm:w-auto bg-yellow-300 hover:bg-yellow-200 cursor-pointer text-white font-semibold py-2 px-6 rounded-md transition disabled:opacity-50"
      >
        {loading ? "Skickar..." : "📤 Skicka"}
      </button>

      {/* Statusmeddelande */}
      {status && (
        <p
          className={`mt-5 text-base font-medium ${
            status.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {status}
        </p>
      )}
    </div>
  );
};

export default SendMessageForm;
