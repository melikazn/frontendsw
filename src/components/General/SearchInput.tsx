// Props: söksträng, funktioner för att uppdatera söksträng, söka och rensa
interface Props {
  query: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
}

// Komponent för sökinmatning med "Sök" och "Rensa"-knappar
const SearchInput = ({ query, onChange, onSearch, onClear }: Props) => {
  return (
    <div className="text-center">
      {/* Textfält för sökning */}
      <input
        type="text"
        placeholder="Sök ord..."
        value={query}
        onChange={(e) => onChange(e.target.value)}        
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
        className="w-full max-w-md h-[44px] px-4 border border-blue-400 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Knappar för sök och rensa */}
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        <button
          onClick={onSearch}
          className="bg-yellow-400 cursor-pointer text-[#00296b] rounded-full px-6 py-2 font-bold shadow-md hover:bg-yellow-300 hover:scale-105 transition-transform"
        >
          🔍 Sök
        </button>
        <button
          onClick={onClear}
          className="bg-yellow-400 cursor-pointer text-[#00296b] rounded-full px-6 py-2 font-bold shadow-md hover:bg-yellow-300  hover:scale-105 transition-transform"
        >
          ❌ Rensa
        </button>
      </div>
    </div>
  );
};

export default SearchInput;
