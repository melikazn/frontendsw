import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

function TestList() {
  const { id } = useParams(); // sectionId från URL
  const [tests, setTests] = useState<any[]>([]);
  const [sectionName, setSectionName] = useState("");

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const [testRes, sectionRes] = await Promise.all([
          api.get(`/admin/tests/section/${id}`),
          api.get(`/admin/sections/${id}`)
        ]);
        setTests(testRes.data);
        setSectionName(sectionRes.data.name);
      } catch (err) {
        console.error("Fel vid hämtning av tester:", err);
      }
    };

    fetchTests();
  }, [id]);

  return (
    <div style={{ maxWidth: 800, margin: "auto" }}>
      <h2>📝 Tester för sektion: KOSKESH {sectionName}</h2>
      {tests.length === 0 ? (
        <p>Inga tester hittades.</p>
      ) : (
        <ul>
          {tests.map(test => (
            <li key={test.id}>
              <strong>{test.title}</strong> – {test.level}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TestList;
