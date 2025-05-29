// Komponent för att visa, redigera och lägga till frågor och svar i ett test
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

function AddQuestions() {
  const { testId } = useParams();
  const navigate = useNavigate();

  // State för befintliga frågor
  const [existingQuestions, setExistingQuestions] = useState<any[]>([]);

  // State för redigering
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [editedText, setEditedText] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedAnswers, setEditedAnswers] = useState<string[]>(["", "", "", ""]);
  const [editedCorrectIndex, setEditedCorrectIndex] = useState<number | null>(null);

  // State för ny fråga
  const [newQuestionText, setNewQuestionText] = useState("");
  const [description, setDescription] = useState("");
  const [newAnswers, setNewAnswers] = useState(["", "", "", ""]);
  const [newCorrectIndex, setNewCorrectIndex] = useState<number | null>(null);

  // Meddelande för feedback
  const [message, setMessage] = useState<string | null>(null);

  // Hämta alla frågor för testet när komponenten laddas
  useEffect(() => {
    fetchQuestions();
  }, [testId]);

  const fetchQuestions = async () => {
    try {
      const res = await api.get(`/admin/tests/${testId}/questions`);
      setExistingQuestions(res.data);
    } catch (err) {
      console.error("Kunde inte hämta frågor:", err);
    }
  };

  // Starta redigering av vald fråga
  const startEditing = (question: any) => {
    setEditingQuestionId(question.id);
    setEditedText(question.question_text);
    setEditedDescription(question.description || "");
    setEditedAnswers(question.answers.map((a: any) => a.answer_text));
    setEditedCorrectIndex(question.answers.findIndex((a: any) => a.is_correct));
  };

  // Spara ändringar för fråga och svar
  const saveEdit = async (questionId: number, answerIds: number[]) => {
    try {
      await api.put(`/admin/questions/${questionId}`, {
        question_text: editedText,
        description: editedDescription
      });
      for (let i = 0; i < 4; i++) {
        await api.put(`/admin/answers/${answerIds[i]}`, {
          answer_text: editedAnswers[i],
          is_correct: i === editedCorrectIndex,
        });
      }
      setEditingQuestionId(null);
      // Uppdatera listan
      fetchQuestions(); 
    } catch (err) {
      console.error("Kunde inte spara ändringar:", err);
    }
  };

  // Ta bort fråga med bekräftelse
  const deleteQuestion = async (id: number) => {
    if (!window.confirm("Är du säker på att du vill ta bort frågan?")) return;
    try {
      await api.delete(`/admin/questions/${id}`);
      fetchQuestions();
    } catch (err) {
      console.error("Kunde inte ta bort fråga:", err);
    }
  };

  // Uppdatera svarsalternativ vid inmatning
  const handleNewAnswerChange = (value: string, index: number) => {
    const updated = [...newAnswers];
    updated[index] = value;
    setNewAnswers(updated);
  };

  // Skicka ny fråga + svar
  const submitNewQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCorrectIndex === null) {
      setMessage("Du måste markera det korrekta svaret.");
      return;
    }

    try {
      const res = await api.post(`/admin/tests/${testId}/questions`, {
        question_text: newQuestionText,
        description: description
      });
      const questionId = res.data.id;

      for (let i = 0; i < 4; i++) {
        await api.post(`/admin/questions/${questionId}/answers`, {
          answer_text: newAnswers[i],
          is_correct: i === newCorrectIndex,
          feedback: ""
        });
      }

      // Återställ formulär
      setNewQuestionText("");
      setDescription("");
      setNewAnswers(["", "", "", ""]);
      setNewCorrectIndex(null);
      setMessage(null);
      fetchQuestions();
    } catch (err: any) {
      console.error("Fel vid sparande:", err);
      setMessage("Kunde inte spara frågan.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 mt-[100px] mb-20">
      {/* Tillbakaknapp */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-sm cursor-pointer text-blue-700 underline hover:text-blue-900"
      >
        ← Tillbaka till tester
      </button>

      {/* Rubrik */}
      <h2 className="text-2xl font-bold text-center text-[#004B94] mb-6">
        🧾 Alla frågor ({existingQuestions.length})
      </h2>

      {/* Lista med frågor */}
      <ul className="space-y-6 mb-10">
        {existingQuestions.map((q, index) => (
          <li key={q.id} className="border rounded p-4 shadow">
            {/* Redigeringsläge */}
            {editingQuestionId === q.id ? (
              <div>
                <textarea
                  className="w-full mb-2 p-2 border rounded"
                  rows={2}
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                />
                <textarea
                  className="w-full mb-2 p-2 border rounded text-sm"
                  rows={2}
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  placeholder="Beskrivning (valfritt)"
                />
                {q.answers.map((a: any, i: number) => (
                  <div key={a.id} className="flex items-center gap-2 mb-2">
                    <input
                      type="radio"
                      name={`edit_correct_${q.id}`}
                      checked={editedCorrectIndex === i}
                      onChange={() => setEditedCorrectIndex(i)}
                    />
                    <input
                      className="flex-1 p-2 border rounded"
                      value={editedAnswers[i]}
                      onChange={(e) => {
                        const updated = [...editedAnswers];
                        updated[i] = e.target.value;
                        setEditedAnswers(updated);
                      }}
                    />
                  </div>
                ))}
                <div className="flex justify-end gap-2 mt-2">
                  <button onClick={() => setEditingQuestionId(null)} className="text-sm cursor-pointer underline text-gray-600">
                    Avbryt
                  </button>
                  <button onClick={() => saveEdit(q.id, q.answers.map((a: any) => a.id))} className="bg-yellow-300 cursor-pointer text-white px-4 py-1 rounded">
                    Spara
                  </button>
                </div>
              </div>
            ) : (
              // Visningsläge
              <>
                <p className="font-semibold">{index + 1}. {q.question_text}</p>
                {q.description && (
                  <p className="text-sm text-gray-600 mb-1">💬 {q.description}</p>
                )}
                <ul className="list-disc list-inside mt-2 text-sm">
                  {q.answers.map((a: any, i: number) => (
                    <li key={a.id} className={a.is_correct ? "text-yellow-300 font-medium" : "text-gray-700"}>
                      {String.fromCharCode(65 + i)}. {a.answer_text}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => startEditing(q)} className="text-yellow-400 cursor-pointer text-sm hover:underline">
                    ✏️ Redigera
                  </button>
                  <button onClick={() => deleteQuestion(q.id)} className="text-red-600 cursor-pointer text-sm hover:underline">
                    🗑 Ta bort
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* Formulär för att lägga till ny fråga */}
      <h2 className="text-xl font-bold mb-3 text-center">➕ Lägg till ny fråga</h2>
      {message && <p className="text-center text-red-600 font-medium mb-4">{message}</p>}

      <form onSubmit={submitNewQuestion} className="bg-white p-6 shadow rounded-xl space-y-4">
        <textarea
          value={newQuestionText}
          onChange={(e) => setNewQuestionText(e.target.value)}
          required
          placeholder="Frågetext"
          className="w-full p-2 border rounded"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Beskrivning (valfritt)"
          className="w-full p-2 border rounded"
        />
        {newAnswers.map((ans, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="radio"
              name="newCorrect"
              checked={newCorrectIndex === i}
              onChange={() => setNewCorrectIndex(i)}
              required
            />
            <input
              type="text"
              placeholder={`Svar ${i + 1}`}
              value={ans}
              onChange={(e) => handleNewAnswerChange(e.target.value, i)}
              required
              className="flex-1 p-2 border rounded"
            />
          </div>
        ))}
        <div className="text-right">
          <button
            type="submit"
            className="bg-[#004B94] text-white px-6 py-2 cursor-pointer rounded hover:bg-blue-800"
            disabled={existingQuestions.length >= 20} 
          >
            💾 Spara fråga
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddQuestions;
