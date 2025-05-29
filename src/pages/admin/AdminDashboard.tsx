import { useEffect, useState } from "react";
import api from "../../api/axios";
import Chart from "../../components/General/Chart";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    testsCompleted: 0,
    levelProgress: [] as { level: string; count: number; percentage: number }[],
    averageScorePerLevel: [] as { level: string; averageScore: number }[],
    forumPosts: 0,
    forumAnswers: 0,
    newForumPosts: 0,
    newMessages: 0,
    usersLast7Days: 0,
    usersLast30Days: 0,
  });

  const [notifications, setNotifications] = useState<any[]>([]);
  const [readNotifications, setReadNotifications] = useState<any[]>([]);

  useEffect(() => {
    fetchStatistics();
    fetchNotifications();
  }, []);

  const fetchStatistics = async () => {
    try {
      const res = await api.get("/admin/statistics");
      setStats(res.data);
    } catch (err) {
      console.error("Kunde inte hämta statistik", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/admin/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error("Kunde inte hämta notifikationer", err);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await api.put(`/admin/notifications/${id}/read`);
      const note = notifications.find((n) => n.id === id);
      setNotifications(notifications.filter((n) => n.id !== id));
      if (note) {
        setReadNotifications((prev) => [...prev, note]);
      }
    } catch {
      alert("Kunde inte markera som läst.");
    }
  };

  return (
    <main className="flex-grow">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-[100px] lg:px-8 py-10 text-[#00296b] font-sans">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">📊 Adminpanel</h2>

        <section className="grid md:grid-cols-2 gap-4 mb-10">
          <button
            onClick={() => (window.location.href = "/admin/users")}
            className="bg-white border border-blue-300 p-4 rounded cursor-pointer shadow hover:bg-blue-50 text-left"
          >
            👥 <strong>Användare totalt:</strong> {stats.totalUsers}
          </button>

          <div className="bg-white border border-blue-300 p-4 rounded shadow">
            <p>📅 Nya användare senaste 7 dagar: {stats.usersLast7Days}</p>
            <p>📅 Nya användare senaste 30 dagar: {stats.usersLast30Days}</p>
          </div>

          <div className="bg-white border border-green-300 p-4 rounded shadow">
            <p>✅ Genomförda tester: {stats.testsCompleted}</p>
          </div>

          <div className="bg-white border border-yellow-300 p-4 rounded shadow">
            <p>💬 Forumfrågor: {stats.forumPosts}</p>
            <p>🗨 Forum-svar: {stats.forumAnswers}</p>
          </div>
        </section>

        <Chart
          title="📈 Nivåfördelning (%)"
          data={stats.levelProgress}
          xKey="level"
          yKeys={[{ key: "percentage", name: "Andel", color: "#fdc500" }]}
        />

        <Chart
          title="🧠 Genomsnittligt testresultat per nivå"
          data={stats.averageScorePerLevel}
          xKey="level"
          yKeys={[{ key: "averageScore", name: "Poäng", color: "#004B94" }]}
        />

        <section className="mb-10">
          <h3 className="text-xl font-semibold mb-4">🔔 Notifikationer</h3>
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <p>Inga nya notifikationer.</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded shadow-sm flex justify-between items-start"
                >
                  <div>
                    <p className="font-bold text-sm sm:text-base">📝 Notis</p>
                    <p className="text-sm text-gray-700">{n.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      📅 {new Date(n.created_at).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => markAsRead(n.id)}
                    className="text-sm text-blue-700 cursor-pointer hover:underline"
                  >📨 Läst</button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminDashboard;