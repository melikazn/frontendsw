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
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [readNotifications, setReadNotifications] = useState<Notification[]>([]);
  const [allResults, setAllResults] = useState<TestResult[]>([]);
  const [passedTests, setPassedTests] = useState<TestResult[]>([]);
  const [failedTests, setFailedTests] = useState<TestResult[]>([]);
  const [notifPage, setNotifPage] = useState(1);
  const [notifTotalPages, setNotifTotalPages] = useState(1);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  useEffect(() => {
    fetchNotificationsAndProfile(notifPage);
    fetchAllTestResults();
  }, [notifPage]);

  const fetchNotificationsAndProfile = async (page: number) => {
    try {
      const [profileRes, notifRes] = await Promise.all([
        api.get("/users/profile"),
        api.get(`/users/notifications?page=${page}&limit=5`),
      ]);
      setUser(profileRes.data);
      const notifData = notifRes.data?.results || [];
      setNotifications(notifData.filter((n: Notification) => n.is_read === 0));
      setReadNotifications(notifData.filter((n: Notification) => n.is_read === 1));
      setNotifPage(notifRes.data.page || 1);
      setNotifTotalPages(notifRes.data.totalPages || 1);
    } catch (err) {
      console.error("Fel vid hämtning av notiser/profil:", err);
    }
  };

  const fetchAllTestResults = async () => {
    try {
      const res = await api.get("/users/my-results?page=1&limit=1000");
      const results = res.data?.results || [];
      setAllResults(results);
      setPassedTests(results.filter((r: any) => r.passed));
      setFailedTests(results.filter((r: any) => !r.passed));
    } catch (err) {
      console.error("Fel vid hämtning av testresultat:", err);
    }
  };

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

  const getMonthlyStats = () => {
    const stats: { [key: string]: { godkänd: number; misslyckad: number } } = {};
    allResults.forEach((r) => {
      const date = new Date(r.created_at);
      const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
      if (!stats[key]) stats[key] = { godkänd: 0, misslyckad: 0 };
      if (r.passed) stats[key].godkänd++;
      else stats[key].misslyckad++;
    });
    return Object.entries(stats).map(([month, data]) => ({ månad: month, ...data }));
  };

  if (!user) return <p className="p-8">🔄 Laddar din dashboard...</p>;

  return (
    <main className="flex-grow min-h-screen">
      <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-20 mt-[100px] py-10 text-[#00296b] font-sans">
        <h2 className="text-3xl lg:text-4xl font-bold mb-10 text-center" data-aos="fade-up">
          👋 Välkommen, {user.name}
        </h2>

        <ProfileInfo user={user} />

        <Chart
          title="📊 Resultatstatistik per månad"
          data={getMonthlyStats()}
          xKey="månad"
          yKeys={[
            { key: "godkänd", name: "Godkänd", color: "#fde047" },
            { key: "misslyckad", name: "Misslyckad", color: "#3b82f6" },
          ]}
        />

        <NotificationsList notifications={notifications} onMarkAsRead={markAsRead} />

        <PassedTestsList tests={passedTests} />

        <FailedTestsList tests={failedTests} />
      </div>
    </main>
  );
}

export default UserDashboardPage;