import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

function GlobalMessageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notification, setNotification] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotification();
  }, [id]);

  const fetchNotification = async () => {
    try {
      const res = await api.get(`/users/notifications/${id}`);
      setNotification(res.data);
    } catch (err) {
      setError("Kunde inte hämta meddelandet.");
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!notification) return <p>Laddar meddelande...</p>;

  return (
    <div style={{ padding: "2rem", maxWidth: 800, margin: "auto" }}>
      <button onClick={() => navigate(-1)}>🔙 Tillbaka</button>
      <h2>📢 Globalt meddelande</h2>
      <div style={{ background: "#fff3cd", padding: "1rem", borderRadius: "5px" }}>
     
        <p>{notification.message}</p>
        <p><small>📅 {new Date(notification.created_at).toLocaleString()}</small></p>
      </div>
    </div>
  );
}

export default GlobalMessageDetail;
