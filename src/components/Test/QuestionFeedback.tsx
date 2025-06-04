// Typ för feedback på en fråga
interface FeedbackItem {
  question: string;
  isCorrect: boolean;
  description?: string;
}

// Props: lista med feedbackobjekt
interface Props {
  feedback: FeedbackItem[];
}

// Komponent som visar resultatgenomgång av quizfrågor
const QuestionFeedback = ({ feedback }: Props) => {
  return (
    <div className="mb-10" data-aos="fade-up">
      <h3 className="text-2xl font-semibold mb-4">🧾 Genomgång av frågor</h3>

      {/* Layout: en kolumn på mobil, två på större skärmar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {feedback.map((item, i) => (
          <div
            key={i}
            className={`p-4 rounded shadow border ${
              item.isCorrect
                ? "bg-green-50 border-green-300" 
                : "bg-red-50 border-red-300"  
            }`}
            data-aos="zoom-in"
          >
            {/* Frågetext */}
            <p className="font-medium mb-1">
              Fråga {i + 1}: {item.question}
            </p>

            {/* Rätt eller fel */}
            <p className={item.isCorrect ? "text-green-700" : "text-red-700"}>
              {item.isCorrect ? "✔️ Rätt svar" : "❌ Fel svar"}
            </p>

            {/* Valfri förklaring om tillgänglig */}
            {item.description && (
              <p className="italic text-sm text-gray-600 mt-1">
                💡 {item.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionFeedback;
