import { motion } from "framer-motion";

interface Props {
  results: {
    test_title: string;           
    correct_answers: number;       
    total_questions: number;     
    passed: boolean;              
    duration_formatted?: string;  
    created_at: string;          
  }[];
}

// Komponent som visar testresultat i en tabell
function ResultsTable({ results }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border-b p-2">Test</th>
            <th className="border-b p-2">Poäng</th>
            <th className="border-b p-2">Krav</th>
            <th className="border-b p-2">Tid</th>
            <th className="border-b p-2">Status</th>
            <th className="border-b p-2">Datum</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, index) => {
            const requiredCorrect = Math.ceil(r.total_questions * 0.7); // Minst 70% krävs

            return (
              // Animerad rad med framer-motion
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50"
              >
                {/* Testets namn */}
                <td className="p-2">{r.test_title}</td>

                {/* Användarens poäng */}
                <td className="p-2">
                  {r.correct_answers} / {r.total_questions}
                </td>

                {/* Visar hur många poäng som krävs för godkänt */}
                <td className="p-2">Minst {requiredCorrect} rätt</td>

                {/* Visar tiden det tog (eller ett streck om okänt) */}
                <td className="p-2">{r.duration_formatted || "–"}</td>

                {/* Godkänd eller ej med färg och ikon */}
                <td
                  className={`p-2 font-semibold ${
                    r.passed ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {r.passed ? "✅ Godkänd" : "❌ Ej godkänd"}
                </td>

                {/* Datum för genomförande */}
                <td className="p-2">
                  {new Date(r.created_at).toLocaleString()}
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ResultsTable;
