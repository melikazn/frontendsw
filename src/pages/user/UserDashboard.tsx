import { useEffect, useState } from "react";
import api from "../../api/axios";
import AOS from "aos";
import "aos/dist/aos.css";
import { Notification, TestResult, User } from "../../types";
import ProfileInfo from "../../components/Dashboard/ProfileInfo";
import Chart from "../../components/General/Chart";
import NotificationsList from "../../components/Dashboard/NotificationsList";
import PassedTestsList from "../../components/Dashboard/PassedTestsList";
import FailedTestsList from "../../components/Dashboard/FailedTestsList";

function UserDashboardPage() {
  // Tillstånd för användarinfo, notifikationer och testresultat
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [readNotifications, setReadNotifications] = useState<Notification[]>([]);
  const [allResults, setAllResults] = useState<TestResult[]>([]);
  const [passedTests, setPassedTests] = useState<TestResult[]>([]);
  const [failedTests, setFailedTests] = useState<TestResult[]>([]);
  const [notifPage, setNotifPage] = useState(1);

  // Initierar animationer
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  // Hämtar data när sidan laddas eller sidnummer ändras
  useEffect(() => {
    fetchNotificationsAndProfile(notifPage);
    fetchAllTestResults();
  }, [notifPage]);

  // Hämtar profil och notifikationer
  const fetchNotificationsAndProfile = async (page: number) => {
    try {
      const [profileRes, notifRes] = await Promise.all([
        api.get("/users/profile"),
        api.get(`/users/notifications?page=${page}&limit=5`),
      ]);
      setUser(profileRes.data);
      const notifData = notifRes.data?.results || [];
      setNotifications(notifData.filter((n) => n.is_read === 0));
      setReadNotifications(notifData.filter((n) => n.is_read === 1));
      setNotifPage(notifRes.data.page || 1);
    } catch (err) {
      console.error("Fel vid hämtning av notiser/profil:", err);
    }
  };

  // Hämtar alla testresultat
  const fetchAllTestResults = async () => {
    try {
      const res = await api.get("/users/my-results?page=1&limit=1000");
      const results = res.data?.results || [];
      setAllResults(results);
      setPassedTests(results.filter((r) => r.passed));
      setFailedTests(results.filter((r) => !r.passed));
    } catch (err) {
      console.error("Fel vid hämtning av testresultat:", err);
    }
  };

  // Markerar notis som läst
  const markAsRead = async (id: number) => {
    try {
      await api.put(`/users/notifications/${id}/read`);
      const note = notifications.find((n) => n.id === id);
      setNotifications(notifications.filter((n) => n.id !== id));
      if (note) {
        setReadNotifications((prev) => [...prev, { ...note, is_read: 1 }]);
      }
    } catch (err) {
      console.error("Kunde inte markera som läst:", err);
    }
  };

  // Sammanställer teststatistik per månad
  const getMonthlyStats = () => {
    const stats: { [key: string]: { godkänd: number; misslyckad: number } } = {};
    allResults.forEach((r) => {
      const date = new Date(r.created_at);
      const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
      if (!stats[key]) stats[key] = { godkänd: 0, misslyckad: 0 };
      r.passed ? stats[key].godkänd++ : stats[key].misslyckad++;
    });
    return Object.entries(stats).map(([månad, data]) => ({ månad, ...data }));
  };

  // Visar laddning medan data hämtas
  if (!user) return <p className="p-8">🔄 Laddar din dashboard...</p>;

  return (
    <main className="flex-grow min-h-screen">
      <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-20 mt-[100px] py-10 text-[#00296b] font-sans">
        <h2 className="text-3xl lg:text-4xl font-bold mb-10 text-center" data-aos="fade-up">
          👋 Välkommen, {user.name}
        </h2>

        {/* Profilinformation */}
        <ProfileInfo user={user} />

        {/* Diagram med månatlig teststatistik */}
        <Chart
          title="📊 Resultatstatistik per månad"
          data={getMonthlyStats()}
          xKey="månad"
          yKeys={[
            { key: "godkänd", name: "Godkänd", color: "#fde047" },
            { key: "misslyckad", name: "Misslyckad", color: "#3b82f6" },
          ]}
        />

        {/* Notiser att läsa */}
        <NotificationsList notifications={notifications} onMarkAsRead={markAsRead} />

        {/* Tidigare lästa notiser */}
        {readNotifications.length > 0 && (
          <section className="mt-10">
            <h3 className="text-xl font-semibold mb-4">📁 Tidigare lästa notifikationer</h3>
            <ul className="space-y-2">
              {readNotifications.map((n) => (
                <li key={n.id} className="text-sm text-gray-500 border-b pb-2">
                  🗂 {n.message}
                  <span className="block text-xs text-gray-400">
                    📅 {new Date(n.created_at).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Listor över godkända och misslyckade tester */}
        <PassedTestsList tests={passedTests} />
        <FailedTestsList tests={failedTests} />
      </div>
    </main>
  );
}

export default UserDashboardPage;
