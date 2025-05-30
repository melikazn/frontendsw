import { FaHeart } from "react-icons/fa";

// Typ för felaktigt besvarade ord
interface IncorrectWord {
  wordId: number;
  word: string;
  translation: string;
}

// Props: lista över felaktiga ord, favoriter och toggle-funktion
interface Props {
  incorrectWords: IncorrectWord[];
  favoriteIds: Set<number>;                  
  toggleFavorite: (wordId: number) => void;
}

// Komponent som visar felaktigt besvarade ord efter ett test
const IncorrectAnswersList = ({ incorrectWords, favoriteIds, toggleFavorite }: Props) => {
  return (
    <div className="mt-10" data-aos="zoom-in">
      <h4 className="text-xl font-semibold mb-3">❌ Felaktigt besvarade ord</h4>
      
      <ul className="space-y-3">
        {incorrectWords.map((word) => (
          <li key={word.wordId} className="flex justify-between items-center">
            {/* Visar ord + översättning */}
            <span className="text-base">
              <strong>{word.word}</strong>: {word.translation}
            </span>

            {/* Hjärtikon för att lägga till/ta bort från favoriter */}
            <FaHeart
              className={`cursor-pointer text-2xl ml-4 transition ${
                favoriteIds.has(word.wordId)
                  ? "text-red-500"
                  : "text-gray-400 hover:text-red-400"
              }`}
              onClick={() => toggleFavorite(word.wordId)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IncorrectAnswersList;
