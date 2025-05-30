import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Props: antal rätta svar och totala frågor
interface Props {
  correct: number;
  total: number;
}

// Färger för rätt och fel  segment i diagrammet
const COLORS = ["#3b82f6", "#fde047"];

// Komponent som visar resultat i ett cirkeldiagram
const TestResultChart = ({ correct, total }: Props) => {
  // Diagramdata baserat på antalet rätt och fel
  const data = [
    { name: "Rätt svar", value: correct },
    { name: "Fel svar", value: total - correct },
  ];

  return (
    <div className="bg-white p-6 rounded shadow mb-10">
      <h3 className="text-xl font-semibold mb-4">📊 Rätt vs. fel</h3>

      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"     
              nameKey="name"   
              cx="50%"         
              cy="50%"           
              outerRadius={100}   
              label               
            >

              {data.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />  
            <Legend />  
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TestResultChart;
