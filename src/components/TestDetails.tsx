import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

function TestDetails() {
  const { testId } = useParams();
  const [questions, setQuestions] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editQuestionText, setEditQuestionText] = useState("");
  const [editAnswers, setEditAnswers] = useState<string[]>([]);
  const [correctIndex, setCorrectIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!testId) return;
    fetchQuestions();
  }, [testId]);

  const fetchQuestions = async () => {
    try {
      const res = await api.get(`/admin/tests/${testId}/questions`);
      setQuestions(res.data);
    } catch (err) {
      setError("Kunde inte hämta frågor.");
    }
  };

  const handleDelete = async (questionId: number) => {
    if (!window.confirm("Vill du ta bort denna fråga?")) return;
    try {
      await api.delete(`/admin/questions/${questionId}`);
      fetchQuestions();
    } catch {
      alert("Kunde inte ta bort frågan.");
    }
  };

  const startEditing = (q: any) => {
    setEditingId(q.id);
    setEditQuestionText(q.question_text);
    setEditAnswers(q.answers.map((a: any) => a.answer_text));
    setCorrectIndex(q.answers.findIndex((a: any) => a.is_correct === 1));
  };

  const saveEdit = async (questionId: number, answerIds: number[]) => {
    try {
      await api.put(`/admin/questions/${questionId}`, {
        question_text: editQuestionText
      });

      for (let i = 0; i < 4; i++) {
        await api.put(`/admin/answers/${answerIds[i]}`, {
          answer_text: editAnswers[i],
          is_correct: i === correctIndex
        });
      }

      setEditingId(null);
      fetchQuestions();
    } catch {
      alert("Kunde inte spara ändringar.");
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: "2rem" }}>
      <h2>🧾 Frågor för test KOSKESH{testId}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {questions.length === 0 ? (
        <p>Inga frågor hittades.</p>
      ) : (
        <ol>
          {questions.map((q, index) => (
            <li key={q.id} style={{ marginBottom: "2rem" }}>
              {editingId === q.id ? (
                <div>
                  <textarea
                    value={editQuestionText}
                    onChange={(e) => setEditQuestionText(e.target.value)}
                    style={{ width: "100%" }}
                  />
                  <ul style={{ marginTop: "1rem" }}>
                    {q.answers.map((a: any, i: number) => (
                      <li key={a.id}>
                        <input
                          type="radio"
                          name={`correct-${q.id}`}
                          checked={correctIndex === i}
                          onChange={() => setCorrectIndex(i)}
                        />
                        <input
                          type="text"
                          value={editAnswers[i]}
                          onChange={(e) => {
                            const newAnswers = [...editAnswers];
                            newAnswers[i] = e.target.value;
                            setEditAnswers(newAnswers);
                          }}
                          style={{ marginLeft: "0.5rem", width: "80%" }}
                        />
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => saveEdit(q.id, q.answers.map((a: any) => a.id))}>💾 Spara</button>
                  <button onClick={() => setEditingId(null)} style={{ marginLeft: "1rem" }}>
                    ❌ Avbryt
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <strong>Fråga {index + 1}:</strong>
                    <div>
                      <button onClick={() => startEditing(q)} style={{ marginRight: "0.5rem" }}>✏️ Redigera</button>
                      <button onClick={() => handleDelete(q.id)} style={{ color: "red" }}>🗑 Ta bort</button>
                    </div>
                  </div>
                  <div>{q.question_text}</div>
                  <ul>
                    {q.answers.map((a: any) => (
                      <li key={a.id}>
                        {a.answer_text}
                        {a.is_correct === 1 && (
                          <span style={{ color: "green", marginLeft: "1rem" }}>✔ rätt svar</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export default TestDetails;
