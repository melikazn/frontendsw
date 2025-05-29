// Props: vald nivå, ändringsfunktion, etikett och om "Alla nivåer"-knapp ska visas
interface Props {
  level: string;                     
  onChange: (value: string) => void;   
  label?: string;                    
  showAllOption?: boolean;         
}

// Lista över tillgängliga CEFR-nivåer
const levels = ["A1", "A2", "B1", "B2", "C1"];

// Komponent för att välja nivå
const LevelSelector = ({ level, onChange, showAllOption = true }: Props) => {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {/* "Alla nivåer"-knapp */}
      {showAllOption && (
        <button
          className={`bg-yellow-400 hover:bg-yellow-300 px-4 py-2 rounded-full cursor-pointer shadow-sm font-medium text-sm sm:text-base transition ${
            level === "" ? "bg-blue-100 text-blue-800" : "hover:bg-blue-50"
          }`}
          onClick={() => onChange("")}
        >
          Alla nivåer
        </button>
      )}

      {/* Knappar för varje enskild nivå */}
      {levels.map((lvl) => (
        <button
          key={lvl}
          className={`bg-yellow-400 hover:bg-yellow-300 px-8 py-4 rounded-full shadow-sm cursor-pointer font-medium text-sm sm:text-base transition ${
            level === lvl ? "bg-blue-100 text-blue-800" : "hover:bg-blue-50"
          }`}
          onClick={() => onChange(lvl)}
        >
          {lvl}
        </button>
      ))}
    </div>
  );
};

export default LevelSelector;
