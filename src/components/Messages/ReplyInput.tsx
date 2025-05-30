interface Props {
  newReply: string;
  setNewReply: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

// Komponent för att skriva och skicka ett nytt svar i en meddelandetråd
const ReplyInput = ({ newReply, setNewReply, onSubmit, disabled = false }: Props) => {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">✏️ Svara</h3>

      {/* Textfält för svaret */}
      <textarea
        rows={5}
        value={newReply}
        onChange={(e) => setNewReply(e.target.value)} 
        placeholder="Skriv ditt svar här..."
        className="w-full p-4 border border-gray-300 rounded-md mb-5 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
      />

      {/* Skicka-knapp, inaktiverad om disabled är true */}
      <button
        onClick={onSubmit}
        disabled={disabled}
        className="w-full sm:w-auto bg-yellow-300 hover:bg-yellow-200 cursor-pointer text-white font-semibold py-2 px-6 rounded-md transition disabled:opacity-50"
      >
        📤 Skicka svar
      </button>
    </div>
  );
};

export default ReplyInput;
