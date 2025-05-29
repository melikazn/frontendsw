import { useNavigate } from "react-router-dom";

function UserMessageOverview() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "2rem", maxWidth: 600, margin: "auto" }}>
      <h2>📨 Meddelanden</h2>
      <p>Välj ett alternativ:</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "2rem" }}>
        <button onClick={() => navigate("/dashboard/messages/send")}>
          ✏️ Skicka meddelande till läraren
        </button>

        <button onClick={() => navigate("/dashboard/messages/list")}>
          📬 Se mina meddelanden
        </button>
      </div>
    </div>
  );
}

export default UserMessageOverview;
