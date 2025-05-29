// Importerar hjärtikon för att visa favoriter
import { FaHeart } from "react-icons/fa";
// Importerar navigeringsfunktion från React Router
import { useNavigate } from "react-router-dom";

// Props: lista med ord + funktion för att ta bort ett ord från favoriter
interface Props {
  words: { id: number; word: string; level: string }[];
  onRemove: (wordId: number) => void;
}

// Komponent som visar en lista över favoritord
const FavoriteWordList = ({ words, onRemove }: Props) => {
  const navigate = useNavigate();

  return (
    <ul className="space-y-3 relative z-0" data-aos="fade-up"> {/* AOS-animation */}
      {words.map((word) => (
        <li
          key={word.id}
          data-aos="fade-up"
          className="flex justify-between items-center bg-gray-50 p-3 rounded shadow hover:shadow-md transition"
        >
          {/* Klickbar länk till ordets detaljsida */}
          <span
            className="cursor-pointer text-blue-600 hover:underline"
            onClick={() => navigate(`/dashboard/vocabulary/detail/${word.id}`)}
          >
            <strong>{word.word}</strong> ({word.level})
          </span>

          {/* Ikon för att ta bort från favoriter */}
          <span onClick={() => onRemove(word.id)} className="cursor-pointer">
            <FaHeart color="red" title="Ta bort från favoriter" />
          </span>
        </li>
      ))}
    </ul>
  );
};

export default FavoriteWordList;
