import { useEffect, useState } from "react";
import api from "../api/axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface QuizHistoryItem {
  correct_answers: number;
  total_questions: number;
  created_at: string;
}

function VocabularyQuizStats({ level }: { level: string }) {
  const [history, setHistory] = useState<QuizHistoryItem[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/users/vocabulary/quiz/progress?level=${level}`);
        setHistory(res.data);
      } catch (err) {
        console.error("Fel vid hämtning av quizhistorik:", err);
      }
    };

    fetchHistory();
  }, [level]);

  const formattedData = history.map(item => ({
    date: new Date(item.created_at).toLocaleDateString(),
    score: Math.round((item.correct_answers / item.total_questions) * 100)
  }));

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>📈 Statistik för VocabularyDetail{level}</h3>
      {formattedData.length === 0 ? (
        <p>Ingen historik tillgänglig.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} tickFormatter={(val) => `${val}%`} />
            <Tooltip formatter={(val: number) => `${val}%`} />
            <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={2} dot={true} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default VocabularyQuizStats;