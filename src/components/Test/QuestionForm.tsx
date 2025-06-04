import { motion } from "framer-motion";

// Fråge- och svarstyp
interface Question {
  id: number;
  question_text: string;
  answers: { id: number; answer_text: string }[];
}

// Props för frågeformuläret
interface Props {
  questions: Question[];                         
  answers: { [key: number]: number };            
  error: string | null;                          
  onAnswer: (questionId: number, answerId: number) => void; 
  onSubmit: () => void;                     
}

// Komponent som visar ett frågeformulär med flervalsfrågor
const QuestionForm = ({ questions, answers, error, onAnswer, onSubmit }: Props) => {
  return (
    <form
      onSubmit={(e) => {
         // Förhindrar omdirigering
        e.preventDefault();
        onSubmit();
      }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8"
    >
      {questions.map((q) => (
        <div key={q.id} className="bg-gray-50 p-6 rounded shadow" data-aos="fade-up">
          {/* Frågetext */}
          <p className="text-lg font-semibold mb-3">❓ {q.question_text}</p>

          {/* Alternativ visas om de finns */}
          {q.answers && q.answers.length > 0 ? (
            q.answers.map((a) => (
              <label key={a.id} className="block ml-4 text-base">
                <input
                  type="radio"
                  name={`question-${q.id}`}                 
                  checked={answers[q.id] === a.id}         
                  onChange={() => onAnswer(q.id, a.id)}     
                  className="mr-2"
                />
                {a.answer_text}
              </label>
            ))
          ) : (
            // Om inga svar finns
            <p className="text-gray-500">Inga svarsalternativ tillgängliga</p>
          )}
        </div>
      ))}

      {/* Visar eventuellt felmeddelande */}
      {error && (
        <p className="text-red-600 lg:col-span-2" data-aos="fade-in">
          {error}
        </p>
      )}

      {/* Skicka in-knapp med animationer och disable-tillstånd */}
      <motion.button
        type="submit"
        disabled={Object.keys(answers).length !== questions.length}
        className="col-span-full bg-yellow-400 cursor-pointer hover:bg-yellow-300 text-[#00296b] font-semibold py-3 px-6 rounded shadow mt-4 disabled:opacity-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        📤 Skicka in svar
      </motion.button>
    </form>
  );
};

export default QuestionForm;
