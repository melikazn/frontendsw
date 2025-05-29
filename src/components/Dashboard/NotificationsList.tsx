// Importerar typen för notifikationer
import { Notification } from "../../types";

// Props: en lista med notifikationer + en funktion för att markera som läst
interface Props {
  notifications: Notification[];
  onMarkAsRead: (id: number) => void;
}

// Komponent som visar en lista med notifikationer
const NotificationsList = ({ notifications, onMarkAsRead }: Props) => (
  <section className="mb-16" data-aos="fade-up"> {/* AOS-animation */}
    <h3 className="text-2xl font-semibold mb-6">🔔 Notifikationer</h3>

    <div className="grid gap-4">
      {notifications.length === 0 ? (
        // Om det inte finns några notiser
        <p>Inga nya notifikationer.</p>
      ) : (
        // Renderar varje notis som ett kort
        notifications.map((n) => (
          <div
            key={`notif-${n.id}`}
            className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded shadow-sm flex justify-between items-start"
          >
            <div className="min-w-0">
              <p className="font-bold text-base">{n.title}</p>
              <p className="text-sm">{n.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                📅 {new Date(n.created_at).toLocaleString()}
              </p>
            </div>

            {/* Knapp för att markera notisen som läst */}
            <button
              onClick={() => onMarkAsRead(n.id)}
              className="text-sm text-blue-700 cursor-pointer hover:underline"
            >
              📨 Läst
            </button>
          </div>
        ))
      )}
    </div>
  </section>
);

export default NotificationsList;
