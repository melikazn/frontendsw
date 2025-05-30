import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

function UserNotificationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notification, setNotification] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotification();
  }, [id]);

  const fetchNotification = async () => {
    try {
      const res = await api.get(`/users/${id}`);
      setNotification(res.data);
    } catch (err) {
      setError("Kunde inte hämta meddelandet.");
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!notification) return <p>Laddar...</p>;

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <button onClick={() => navigate("/dashboard/messages")}>🔙 Tillbaka</button>
      <h2>📢 Globalt meddelande</h2>
      <p style={{ fontSize: "1.2rem", background: "#fff7cc", padding: "1rem", borderRadius: "6px" }}>
        {notification.message}
      </p>
      <p>🕒 {new Date(notification.created_at).toLocaleString()}</p>
    </div>
  );
}

export default UserNotificationDetail;
