import { TestResult } from "../../types";

// Definierar props-typ: en lista med testresultat
interface Props {
  tests: TestResult[];
}

// Komponent som visar misslyckade tester
const FailedTestsList = ({ tests }: Props) => (
  {/* För AOS-animation vid scroll */}
  <section data-aos="fade-up"> 
    <h3 className="text-2xl font-semibold mb-6">🕓 Tester att förbättra</h3>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tests.length === 0 ? (
        // Visas om det inte finns några misslyckade tester
        <p>Inga misslyckade tester.</p>
      ) : (
        // Renderar varje testkort
        tests.map((t) => (
          <div key={t.test_id} className="p-4 bg-red-50 border border-red-200 rounded shadow">
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

export default FailedTestsList;
