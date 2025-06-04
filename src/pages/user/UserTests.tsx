import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";

function UserTests() {
  // Hämta sektionens ID från URL:en
  const { id } = useParams(); 

  // Lokalt state för tester och felmeddelanden
  const [tests, setTests] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Hämta tester när komponenten laddas eller när id ändras
  useEffect(() => {
    fetchTests();
  }, [id]);

  // Anrop till backend för att hämta tester för en sektion
  const fetchTests = async () => {
    try {
      const res = await api.get(`/users/sections/${id}/tests`);
      setTests(res.data);
    } catch (err: any) {
      console.error("Fel vid hämtning av tester:", err);
      setError("Det gick inte att hämta testerna.");
    }
  };

  return (
    <div>
      <h2>🧪 Tester för denna sektion</h2>

      {/* Visa fel om något gick fel */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Visa lista eller meddelande om inga tester finns */}
      {tests.length === 0 ? (
        <p>Inga tester hittades.</p>
      ) : (
        <ul>
          {tests.map(test => (
            <li key={test.id}>{test.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserTests;
