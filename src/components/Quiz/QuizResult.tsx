// Props: resultatdata och retry-funktion
interface Props {
  score: number;        
  total: number;            
  required: number;          
  onRetry: () => void;     
}

// Komponent som visar quizresultat och om användaren blev godkänd
const QuizResult = ({ score, total, required, onRetry }: Props) => {
  return (
    <div className="mt-12" data-aos="fade-in">
      <h3 className="text-2xl font-bold mb-3">Resultat</h3>

      {/* Visar hur många rätt användaren fick */}
      <p className="text-lg">
        Du fick <strong>{score}</strong> av <strong>{total}</strong> rätt.
      </p>

      {/* Godkänd eller underkänd meddelande */}
      <p className="mt-2 text-base">
        {score >= required
          ? "🎉 Du är godkänd!"
          : `❌ Du måste ha minst ${required} rätt för att bli godkänd. Försök igen!`}
      </p>

      {/* Försök igen-knapp */}
      <button
        onClick={onRetry}
        className="mt-4 bg-gray-200 cursor-pointer hover:bg-gray-300 px-4 py-2 rounded"
      >
        🔁 Försök igen
      </button>
    </div>
  );
};

export default QuizResult;
