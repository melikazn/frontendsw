import { useParams, useNavigate } from "react-router-dom";

function UserVocabularyAlphabet() {
  const { level } = useParams();
  const navigate = useNavigate();

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ".split("");

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>🔤 Välj en bokstav för nivå {level}</h2>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem", marginTop: "2rem" }}>
        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => navigate(`/vocabulary/${level}/${letter}`)}
            style={{
              padding: "1rem",
              minWidth: "3rem",
              fontSize: "1.2rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              backgroundColor: "#f8f8f8",
              cursor: "pointer",
            }}
          >
            {letter}
          </button>
        ))}
      </div>
      <button onClick={() => navigate("/vocabulary")} style={{ marginTop: "2rem" }}>
        ⬅ Tillbaka
      </button>
    </div>
  );
}

export default UserVocabularyAlphabet;
