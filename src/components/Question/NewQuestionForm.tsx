import { useState } from "react";

// Typdefinitioner för props
interface Props {
  onSubmit: (
    questionText: string,
    description: string,
    answers: string[],
    correctIndex: number
  ) => void;
  isDisabled: boolean;
}

// Formulär för att skapa en ny fråga
const NewQuestionForm = ({ onSubmit, isDisabled }: Props) => {
  // States för formulärfälten
  const [questionText, setQuestionText] = useState("");        
  const [description, setDescription] = useState("");          
  const [answers, setAnswers] = useState(["", "", "", ""]);    
  const [correctIndex, setCorrectIndex] = useState<number | null>(null); 
  const [message, setMessage] = useState<string | null>(null); 

  // Hantera formens inlämning
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (correctIndex === null) {
      setMessage("Du måste markera det korrekta svaret.");
      return;
    }
    setMessage(null);
    onSubmit(questionText, description, answers, correctIndex);

    // Återställ fälten
    setQuestionText("");
    setDescription("");
    setAnswers(["", "", "", ""]);
    setCorrectIndex(null);
  };

  // Uppdatera enskilda svar i arrayen
  const handleAnswerChange = (value: string, index: number) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 shadow rounded-xl space-y-4"
    >
      {/* Visa felmeddelande om inget korrekt svar valts */}
      {message && (
        <p className="text-center text-red-600 font-medium">{message}</p>
      )}

      {/* Frågetext */}
      <textarea
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
        required
        placeholder="Frågetext"
        className="w-full p-2 border rounded"
      />

      {/* Valfri beskrivning som visas efter testet */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Beskrivning (valfritt)"
        className="w-full p-2 border rounded"
      />

      {/* Svarsalternativ med knapp för att markera korrekt svar */}
      {answers.map((ans, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="radio"
            name="newCorrect"
            checked={correctIndex === i}
            onChange={() => setCorrectIndex(i)}
            required
          />
          <input
            type="text"
            placeholder={`Svar ${i + 1}`}
            value={ans}
            onChange={(e) => handleAnswerChange(e.target.value, i)}
            required
            className="flex-1 p-2 border rounded"
          />
        </div>
      ))}

      {/* Spara-knapp */}
      <div className="text-right">
        <button
          type="submit"
          disabled={isDisabled}
          className="bg-[#004B94] text-white px-6 py-2 cursor-pointer rounded hover:bg-blue-800"
        >
          💾 Spara fråga
        </button>
      </div>
    </form>
  );
};

export default NewQuestionForm;
