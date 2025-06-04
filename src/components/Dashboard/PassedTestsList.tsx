import { TestResult } from "../../types";

// Props: lista med godkända tester
interface Props {
  tests: TestResult[];
}

// Komponent som visar tester där användaren fått godkänt
const PassedTestsList = ({ tests }: Props) => (
  <section className="mb-16" data-aos="fade-up"> 
    <h3 className="text-2xl font-semibold mb-6">✅ Klarade tester</h3>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tests.length === 0 ? (
        // Om inga godkända tester finns
        <p>Inga godkända tester.</p>
      ) : (
        // Renderar varje godkänt test
        tests.map((t) => (
          <div key={t.test_id} className="p-4 bg-green-50 border border-green-200 rounded shadow">
            <p className="text-base font-medium">{t.test_title}</p>
            <p className="text-sm text-gray-700">
              Du fick poäng: {t.correct_answers}/{t.total_questions}
            </p>
          </div>
        ))
      )}
    </div>
  </section>
);

export default PassedTestsList;
