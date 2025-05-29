import { useEffect, useState } from "react";
import api from "../api/axios";

function AdminNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/admin/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error("Kunde inte hämta notifikationer", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await api.put(`/admin/notifications/${id}/read`);
      setNotifications(notifications.filter((n) => n.id !== id));
    } catch (err) {
      alert("Kunde inte markera som läst.");
    }
  };

  if (loading) return <p>Laddar notifikationer...</p>;

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: "2rem" }}>
      <h2>🔔 Notifikationer</h2>
      {notifications.length === 0 ? (
        <p>Inga nya notifikationer.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {notifications.map((n) => (
            <li
              key={n.id}
              style={{
                border: "1px solid #ccc",
                padding: "1rem",
                marginBottom: "1rem",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>
                <strong>{n.message}</strong>
                <br />
                <small>{new Date(n.created_at).toLocaleString()}</small>
              </div>
              <button onClick={() => markAsRead(n.id)}>📨 Läs</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminNotifications;
