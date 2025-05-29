// Importerar komponenter från Recharts för att rita linjediagram
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Props: data för tidigare quizresultat
interface Props {
  data: { name: string; score: number }[]; // name = datum/titel, score = procent
}

// Visar en linjegraf över tidigare quizresultat
const QuizHistoryChart = ({ data }: Props) => {
  return (
    <div className="my-12" data-aos="zoom-in">
      <h4 className="text-xl font-semibold mb-4">📈 Resultathistorik</h4>

      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />      
            <XAxis dataKey="name" />                  
            <YAxis domain={[0, 100]} />              
            <Tooltip />                           
            <Line
              type="monotone"
              dataKey="score"                       
              stroke="#007bff"                         
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default QuizHistoryChart;
