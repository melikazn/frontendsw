import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { VocabularyWord } from "../../types";

// Props: lista med ord + funktion för att toggla favoritstatus
interface Props {
  words: VocabularyWord[];                       
  onToggleFavorite: (wordId: number) => void;    
}

// Komponent som visar en lista med ord, deras info och hjärtikon
const WordList = ({ words, onToggleFavorite }: Props) => {
  const navigate = useNavigate();

  return (
    <ul className="space-y-4">
      {words.map((word) => (
        <li
          key={word.id}
          className="flex justify-between items-start border-b pb-2"
        >
          {/* Klickbart ordblock som navigerar till ordets detaljsida */}
          <div
            className="cursor-pointer flex-1"
            onClick={() => navigate(`/dashboard/vocabulary/detail/${word.id}`)}
          >
            <strong className="text-blue-600 text-lg">{word.word}</strong>{" "}– {word.translation}
            <div className="text-sm text-gray-500 mt-1">
              📚 {word.word_class} | 🎯 {word.level}
            </div>
          </div>

          {/* Hjärtikon för att favoritmarkera/avmarkera */}
          <span
            onClick={() => onToggleFavorite(word.id)}
            className="cursor-pointer ml-4"
          >
            {word.is_favorite ? (
              <FaHeart className="text-red-500" />
            ) : (
              <FaRegHeart />
            )}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default WordList;
