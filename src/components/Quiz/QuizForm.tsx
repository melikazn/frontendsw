// Typ för varje quizfråga
interface QuizQuestion {
  wordId: number;
  word: string;
  options: string[];
}

// Props till quizformuläret
interface Props {
  questions: QuizQuestion[];               
  answers: { [id: number]: string };            
  onAnswer: (wordId: number, selected: string) => void; 
  onSubmit: () => void;                    
  buttonStyle: string;                        
}

// Komponent som renderar quizfrågorna som ett formulär
const QuizForm = ({ questions, answers, onAnswer, onSubmit, buttonStyle }: Props) => {
  return (
    <form
      onSubmit={(e) => {
        // Hindrar sidomladdning
        e.preventDefault(); 
         // Anropar extern submit-funktion
        onSubmit();        
      }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-8"
    >
      {/* Loopa igenom varje fråga */}
      {questions.map((q, index) => (
        <div key={q.wordId} className="bg-gray-50 p-6 rounded shadow" data-aos="fade-up">
          {/* Frågetext */}
          <p className="text-lg font-semibold mb-3">
            {index + 1}. Vad betyder <span className="text-blue-900">"{q.word}"</span>?
          </p>

          {/* Alternativ som radioknappar */}
          {q.options.map((opt) => (
            <label key={opt} className="block ml-4 text-base">
              <input
                type="radio"
                name={`q-${q.wordId}`}            
                value={opt}
                // Visar valt alternativ
                checked={answers[q.wordId] === opt}   
                // Svarshantering
                onChange={() => onAnswer(q.wordId, opt)} 
                className="mr-2"
              />
              {opt}
            </label>
          ))}
        </div>
      ))}

      {/* Skicka in-knapp */}
      <button type="submit" className={`${buttonStyle} col-span-full mt-4`}>
        ✅ Skicka in
      </button>
    </form>
  );
};

export default QuizForm;
