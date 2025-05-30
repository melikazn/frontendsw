import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";

function UserTests() {
  const { id } = useParams(); 
  const [tests, setTests] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTests();
  }, [id]);

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
      {error && <p style={{ color: "red" }}>{error}</p>}
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
