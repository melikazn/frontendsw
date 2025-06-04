import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import QuestionItem from "../../components/Question/QuestionItem";
import NewQuestionForm from "../../components/Question/NewQuestionForm";

function AddQuestions() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [existingQuestions, setExistingQuestions] = useState<any[]>([]);

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

  const handleSaveEdit = async (
    questionId: number,
    {
      text,
      description,
      answers,
      correctIndex,
    }: { text: string; description: string; answers: string[]; correctIndex: number }
  ) => {
    const question = existingQuestions.find((q) => q.id === questionId);
    const answerIds = question.answers.map((a: any) => a.id);

    try {
      await api.put(`/admin/questions/${questionId}`, {
        question_text: text,
        description,
      });

      for (let i = 0; i < 4; i++) {
        await api.put(`/admin/answers/${answerIds[i]}`, {
          answer_text: answers[i],
          is_correct: i === correctIndex,
        });
      }

      fetchQuestions();
    } catch (err) {
      console.error("Kunde inte spara ändringar:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Är du säker på att du vill ta bort frågan?")) return;
    try {
      await api.delete(`/admin/questions/${id}`);
      fetchQuestions();
    } catch (err) {
      console.error("Kunde inte ta bort fråga:", err);
    }
  };

  const handleCreateNewQuestion = async (
    questionText: string,
    description: string,
    answers: string[],
    correctIndex: number
  ) => {
    try {
      const res = await api.post(`/admin/tests/${testId}/questions`, {
        question_text: questionText,
        description,
      });

      const questionId = res.data.id;

      for (let i = 0; i < 4; i++) {
        await api.post(`/admin/questions/${questionId}/answers`, {
          answer_text: answers[i],
          is_correct: i === correctIndex,
          feedback: "",
        });
      }

      fetchQuestions();
    } catch (err) {
      console.error("Fel vid sparande:", err);
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
        {existingQuestions.map((q: any, i: number) => (
          <QuestionItem
            key={q.id}
            index={i}
            question={q}
            onSave={handleSaveEdit}
            onDelete={handleDelete}
          />
        ))}
      </ul>

      {/* Formulär för ny fråga */}
      <h2 className="text-xl font-bold mb-3 text-center">➕ Lägg till ny fråga</h2>
      <NewQuestionForm
        onSubmit={handleCreateNewQuestion}
        isDisabled={existingQuestions.length >= 20}
      />
    </div>
  );
}

export default AddQuestions;
