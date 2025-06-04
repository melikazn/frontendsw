import { useNavigate } from "react-router-dom";

// Props: tar emot språknivå (A1–C1) som används för navigation
interface Props {
  level: string;
}

// Alfabetet med svenska bokstäver
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ".split("");

// Komponent som visar en lista med bokstäver som knappar
const AlphabetSelector = ({ level }: Props) => {
  const navigate = useNavigate(); // Hook för att navigera till annan sida

  return (
    <div className="mt-[100px]">
      {/* Rubrik */}
      <h3 className="text-xl sm:text-2xl font-semibold text-[#004B94] mb-4">🔤 Välj en bokstav</h3>

      {/* Bokstavsknappar */}
      <div className="flex flex-wrap justify-center gap-2">
        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => navigate(`/admin/vocabulary/${level}/${letter}`)} 
            className="bg-blue-100 cursor-pointer hover:bg-blue-200 text-blue-800 font-medium rounded-full px-4 py-2"
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AlphabetSelector;
