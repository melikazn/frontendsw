import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import TestResultChart from "../../components/General/TestResulatChart";
import QuestionFeedback from "../../components/Test/QuestionFeedback";
import QuestionForm from "../../components/Test/QuestionForm";

function UserTestStart() {
  // Hämta test-id från URL
  const { testId } = useParams();
  const navigate = useNavigate();

  // State för frågor, svar, resultat, m.m.
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Initiera AOS och starta testet vid mount
  useEffect(() => {
    AOS.init({ duration: 600, once: true });
    if (testId) startTest();
  }, []);

  // Uppdatera tid varje sekund så länge testet pågår
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!submitted && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime, submitted]);

  // Formatera sekunder till mm:ss
  const formatElapsed = (seconds: number) => {
    const min = Math.floor(seconds / 60).toString().padStart(2, "0");
    const sec = (seconds % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  // Startar testet och hämtar frågor
  const startTest = async () => {
    try {
      await api.post(`/users/tests/${testId}/start`);
      setStartTime(new Date());
      setElapsedTime(0);
      const questionsRes = await api.get(`/users/tests/${testId}/questions`);
      setQuestions(questionsRes.data || []);
    } catch (err) {
      console.error("Fel vid start/hämtning av test", err);
    } finally {
      setLoading(false);
    }
  };

  // Registrera användarens svar
  const handleAnswer = (questionId: number, answerId: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };

  // Skicka in testet till backend
  const handleSubmit = async () => {
    setError(null);
    if (Object.keys(answers).length !== questions.length) {
      setError("Du måste svara på alla frågor innan du skickar in testet.");
      return;
    }

    const formattedAnswers = Object.entries(answers).map(([qId, aId]) => ({
      questionId: Number(qId),
      answerId: aId,
    }));

    try {
      const res = await api.post(`/users/tests/${testId}/submit`, {
        answers: formattedAnswers,
        startedAt: startTime?.toISOString(),
      });
      setResult(res.data);
      setFeedback(res.data.feedback || []);
      setSubmitted(true);
    } catch (err: any) {
      console.error("Fel vid inlämning av test", err);
      setError(err?.response?.data?.message || "Något gick fel vid inlämning.");
    }
  };

  // Visar laddningsstatus
  if (loading)
    return <p className="text-center mt-20" data-aos="fade">🔄 Laddar test...</p>;

  return (
    <AnimatePresence mode="wait">
      {submitted && result ? (
        // Visar testresultatet
        <motion.div
          key="result"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="max-w-screen-xl mx-auto px-4 py-10 mt-[100px] text-[#00296b]"
        >
          <h2 className="text-3xl font-bold mb-4" data-aos="fade-down">
            ✅ Testresultat
          </h2>
          <p className="mb-1 text-lg">
            <strong>Rätt svar:</strong> {result.correctAnswers} / {result.totalQuestions}
          </p>
          <p className="mb-1 text-lg">
            <strong>Tid:</strong> {result.duration}
          </p>
          <p className="mb-6 text-lg">
            <strong>Status:</strong> {result.passed ? "Godkänt ✅" : "Ej godkänt ❌"}
          </p>

          <TestResultChart correct={result.correctAnswers} total={result.totalQuestions} />

          {feedback.length > 0 && (
            <QuestionFeedback feedback={feedback} />
          )}

          <button
            onClick={() => navigate("/dashboard/tests")}
            className="bg-blue-600 hover:bg-blue-500 cursor-pointer text-white font-medium py-2 px-4 rounded"
          >
            ⬅ Tillbaka till tester
          </button>
        </motion.div>
      ) : (
        // Visar testformuläret
        <motion.div
          key="test"
          className="max-w-screen-xl mx-auto px-4 py-10 mt-[100px] text-[#00296b]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold" data-aos="fade-down">
              📝 Test
            </h2>
            {startTime && (
              <motion.div
                className="text-base bg-gray-100 text-gray-700 px-4 py-1 rounded shadow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                ⏱ Tid: {formatElapsed(elapsedTime)}
              </motion.div>
            )}
          </div>

          <QuestionForm
            questions={questions}
            answers={answers}
            error={error}
            onAnswer={handleAnswer}
            onSubmit={handleSubmit}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default UserTestStart;
