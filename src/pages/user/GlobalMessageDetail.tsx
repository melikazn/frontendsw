import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

function GlobalMessageDetail() {
  // Hämtar ID från URL:en
  const { id } = useParams();
  const navigate = useNavigate();

  // Tillstånd för meddelandet och eventuell felhantering
  const [notification, setNotification] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Hämta meddelandet så fort komponenten laddas 
  useEffect(() => {
    fetchNotification();
  }, [id]);

  // Funktion som anropar backend för att hämta ett globalt meddelande baserat på id
  const fetchNotification = async () => {
    try {
      const res = await api.get(`/users/notifications/${id}`);
      setNotification(res.data); // Sparar resultatet
    } catch (err) {
      setError("Kunde inte hämta meddelandet."); // Visar fel om något går snett
    }
  };

  // Visar felmeddelande om något gått fel
  if (error) return <p className="text-red-600 text-center mt-10">{error}</p>;

  // Visar laddningsindikator om meddelandet inte är hämtat än
  if (!notification) return <p className="text-center mt-10 text-gray-600">Laddar meddelande...</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Tillbaka-knapp */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        🔙 Tillbaka
      </button>

      {/* Rubrik */}
      <h2 className="text-2xl font-bold text-[#00296b] mb-4">📢 Globalt meddelande</h2>

      {/* Meddelandets innehåll i en stilig ruta */}
      <div className="bg-yellow-100 border border-yellow-300 p-6 rounded-xl shadow">
        <p className="text-lg text-[#00296b]">{notification.message}</p>
        <p className="text-sm text-gray-700 mt-4">
          📅 {new Date(notification.created_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default GlobalMessageDetail;
