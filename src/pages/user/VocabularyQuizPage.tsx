
import { useEffect, useRef, useState } from "react";
import api from "../../api/axios";
import AOS from "aos";
import "aos/dist/aos.css";
import LevelSelector from "../../components/Selector/LevelSelector";
import QuizHistoryChart from "../../components/Quiz/QuizHistoryChart";
import QuizForm from "../../components/Quiz/QuizForm";
import QuizResult from "../../components/Quiz/QuizResult";
import IncorrectAnswersList from "../../components/Quiz/IncorrectAnswersList";

interface QuizQuestion {
  wordId: number;
  word: string;
  options: string[];
}

interface IncorrectWord {
  wordId: number;
  word: string;
  translation: string;
}

interface HistoryEntry {
  letter: string;
  correct_answers: number;
  total_questions: number;
  duration_seconds: number;
  created_at: string;
}

function VocabularyQuizPage() {
  const [level, setLevel] = useState("A1");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<{ [id: number]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [incorrectWords, setIncorrectWords] = useState<IncorrectWord[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const startTime = useRef<number>(0);

  useEffect(() => {
    AOS.init({ duration: 600, once: true });
    fetchQuiz();
    fetchHistory();
    fetchFavorites();
  }, [level]);

  const fetchQuiz = async () => {
    try {
      const res = await api.get(`/users/vocabulary/quiz/full?level=${level}`);
      setQuestions(res.data.questions);
      setAnswers({});
      setSubmitted(false);
      setScore(null);
      setIncorrectWords([]);
      startTime.current = performance.now();
    } catch {
      alert("Kunde inte hämta quiz.");
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await api.get(`/users/vocabulary/quiz-history?level=${level}`);
      setHistory(res.data);
    } catch (err) {
      console.error("Fel vid hämtning av statistik:", err);
    }
  };

  const fetchFavorites = async () => {
    try {
      const res = await api.get("/users/favorites/words");
      const ids = res.data.map((w: any) => w.word_id);
      setFavoriteIds(new Set(ids));
    } catch (err) {
      console.error("Kunde inte hämta favoriter.");
    }
  };

  const handleAnswer = (wordId: number, selected: string) => {
    setAnswers((prev) => ({ ...prev, [wordId]: selected }));
  };

  const handleSubmit = async () => {
    const payload = questions.map((q) => ({
      wordId: q.wordId,
      userAnswer: answers[q.wordId] || "",
    }));
    const durationSeconds = Math.floor((performance.now() - startTime.current) / 1000);

    try {
      const res = await api.post("/users/vocabulary/quiz", {
        level,
        letter: "*",
        questions: payload,
        duration_seconds: durationSeconds,
      });
      setScore(res.data.correct);
      setSubmitted(true);
      setIncorrectWords(res.data.incorrectWords || []);
      fetchHistory();
      fetchFavorites();
    } catch {
      alert("Fel vid inlämning.");
    }
  };

  const toggleFavorite = async (wordId: number) => {
    const isFavorite = favoriteIds.has(wordId);
    try {
      if (isFavorite) {
        await api.delete(`/users/favorites/words/${wordId}`);
        setFavoriteIds((prev) => {
          const copy = new Set(prev);
          copy.delete(wordId);
          return copy;
        });
      } else {
        await api.post(`/users/favorites/words/${wordId}`);
        setFavoriteIds((prev) => new Set(prev).add(wordId));
      }
    } catch {
      alert("Kunde inte uppdatera favoritstatus.");
    }
  };

  const requiredCorrect = Math.ceil(questions.length * 0.7);
  const chartData = history.map((entry, index) => ({
    name: `${entry.letter || "*"}/${index + 1}`,
    score: Math.round((entry.correct_answers / entry.total_questions) * 100),
  }));

  const buttonStyle =
    "bg-[#fdc500] text-[#00296b] rounded-full px-6 py-3 text-lg sm:text-xl font-bold shadow-lg transition-transform duration-300 hover:bg-[#ffe066] hover:scale-105 cursor-pointer";

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto py-6 text-[#00296b] mt-[100px] font-sans">
      <img
        src="/images/quiz.png"
        className="mx-auto my-4 max-w-[250px] w-full h-auto"
        alt="Teacher icon"
        data-aos="flip-left"
      />
      <div className="mb-10" data-aos="fade-up">
        <LevelSelector level={level} onChange={setLevel} showAllOption={false} />
      </div>

      {history.length > 0 && <QuizHistoryChart data={chartData} />}

      {!submitted && (
        questions.length === 0 ? (
          <p className="text-lg">🔄 Laddar frågor...</p>
        ) : (
          <QuizForm
            questions={questions}
            answers={answers}
            onAnswer={handleAnswer}
            onSubmit={handleSubmit}
            buttonStyle={buttonStyle}
          />
        )
      )}

      {submitted && score !== null && (
        <>
          <QuizResult
            score={score}
            total={questions.length}
            required={requiredCorrect}
            onRetry={fetchQuiz}
          />
          {incorrectWords.length > 0 && (
            <IncorrectAnswersList
              incorrectWords={incorrectWords}
              favoriteIds={favoriteIds}
              toggleFavorite={toggleFavorite}
            />
          )}
        </>
      )}
    </div>
  );
}

export default VocabularyQuizPage;