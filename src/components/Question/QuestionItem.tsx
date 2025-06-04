import { useState } from "react";

// Gränssnitt för ett svar
interface Answer {
  id: number;
  answer_text: string;
  is_correct: boolean;
}

// Gränssnitt för en fråga
interface Question {
  id: number;
  question_text: string;
  description?: string;
  answers: Answer[];
}

// Props för komponenten
interface Props {
  question: Question;
  index: number;
  onSave: (
    questionId: number,
    updated: {
      text: string;
      description: string;
      answers: string[];
      correctIndex: number;
    }
  ) => void;
  onDelete: (id: number) => void;
}

// Komponent för att visa/redigera en enskild fråga
const QuestionItem = ({ question, index, onSave, onDelete }: Props) => {
  const [isEditing, setIsEditing] = useState(false); 
  const [text, setText] = useState(question.question_text); 
  const [description, setDescription] = useState(question.description || ""); 
  const [answers, setAnswers] = useState<string[]>(
    question.answers.map((a) => a.answer_text) // Svarsalternativen
  );
  const [correctIndex, setCorrectIndex] = useState(
    question.answers.findIndex((a) => a.is_correct) // Index för korrekt svar
  );

  // Spara ändringar
  const handleSave = () => {
    onSave(question.id, { text, description, answers, correctIndex });
    setIsEditing(false); // Avsluta redigeringsläge
  };

  return (
    <li className="border rounded p-4 shadow">
      {isEditing ? (
        // Redigeringsläge
        <>
          {/* Frågetext */}
          <textarea
            className="w-full mb-2 p-2 border rounded"
            rows={2}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {/* Beskrivning */}
          <textarea
            className="w-full mb-2 p-2 border rounded text-sm"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Beskrivning (valfritt)"
          />
          {/* Redigera svar + markera korrekt */}
          {answers.map((a, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <input
                type="radio"
                name={`edit_correct_${question.id}`}
                checked={correctIndex === i}
                onChange={() => setCorrectIndex(i)}
              />
              <input
                className="flex-1 p-2 border rounded"
                value={a}
                onChange={(e) => {
                  const updated = [...answers];
                  updated[i] = e.target.value;
                  setAnswers(updated);
                }}
              />
            </div>
          ))}
          {/* Spara/Avbryt-knappar */}
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => setIsEditing(false)}
              className="text-sm cursor-pointer underline text-gray-600"
            >
              Avbryt
            </button>
            <button
              onClick={handleSave}
              className="bg-yellow-300 cursor-pointer text-white px-4 py-1 rounded"
            >
              Spara
            </button>
          </div>
        </>
      ) : (
        // Visningsläge
        <>
          {/* Visar frågan och eventuell beskrivning */}
          <p className="font-semibold">
            {index + 1}. {question.question_text}
          </p>
          {question.description && (
            <p className="text-sm text-gray-600 mb-1">
              💬 {question.description}
            </p>
          )}
          {/* Visar svarsalternativ med markerat korrekt */}
          <ul className="list-disc list-inside mt-2 text-sm">
            {question.answers.map((a, i) => (
              <li
                key={a.id}
                className={
                  a.is_correct
                    ? "text-yellow-300 font-medium"
                    : "text-gray-700"
                }
              >
                {String.fromCharCode(65 + i)}. {a.answer_text}
              </li>
            ))}
          </ul>
          {/* Redigera/Ta bort-knappar */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setIsEditing(true)}
              className="text-yellow-400 cursor-pointer text-sm hover:underline"
            >
              ✏️ Redigera
            </button>
            <button
              onClick={() => onDelete(question.id)}
              className="text-red-600 cursor-pointer text-sm hover:underline"
            >
              🗑 Ta bort
            </button>
          </div>
        </>
      )}
    </li>
  );
};

export default QuestionItem;
