// Importerar komponenter från Recharts-biblioteket för att skapa stapeldiagram
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Typdefinition för varje Y-axelvärde 
interface YKey {
  key: string;
  color?: string;
  name?: string;
}

// Props till diagramkomponenten
interface Props {
  data: any[];             
  xKey: string;         
  yKeys: YKey[];          
  height?: number;        
  title?: string;          
}

// Återanvändbar diagramkomponent
const Chart = ({ data, xKey, yKeys, height = 350, title }: Props) => {
  // Om ingen giltig data ges, rendera ingenting
  if (!Array.isArray(data)) return null;

  return (
    <section className="mb-16">
      
      {title && <h3 className="text-2xl font-semibold mb-6">{title}</h3>}

      <div className="w-full 2xl:w-[90%] mx-auto h-[350px] bg-white rounded-xl shadow p-4">
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data}>
            <XAxis dataKey={xKey} />           
            <YAxis allowDecimals={false} />       
            <Tooltip />                            
            <Legend />                           
            
            {/* Generera en <Bar> per yKey */}
            {yKeys.map((y) => (
              <Bar
                key={y.key}
                dataKey={y.key}
                fill={y.color || "#3b82f6"}        
                name={y.name || y.key}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default Chart;
