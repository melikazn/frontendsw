import { useNavigate } from "react-router-dom";         
import { VocabularyWord } from "../../types";           

// Props som komponenten tar emot
interface Props {
  words: VocabularyWord[];                              
}

// Komponent som visar ord för gästanvändare
const GuestWordList = ({ words }: Props) => {
  const navigate = useNavigate();                       

  return (
    <ul className="space-y-4">                          
      {words.map((word) => (
        <li
          key={word.id}
          className="flex justify-between items-start border-b pb-2"  
        >
          <div
            className="cursor-pointer flex-1"             // Hela rutan är klickbar
            onClick={() => navigate(`/guestvocabulary/detail/${word.id}`)}  // Navigerar till detaljsidan för ordet
          >
            {/* Själva ordet + översättning */}
            <strong className="text-blue-600 text-lg">{word.word}</strong> – {word.translation}

            {/* Extrainformation under raden */}
            <div className="text-sm text-gray-500 mt-1">
              📚 {word.word_class} | 🎯 {word.level}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GuestWordList;
