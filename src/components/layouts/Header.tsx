import HeaderGuest from "./HeaderGuest";
import HeaderUser from "./HeaderUser";
import HeaderAdmin from "./HeaderAdmin";

// Dynamisk Header-komponent som visar rätt version beroende på inloggad användare
export default function Header() {
  // Hämtar användardata från localStorage eller null
  const user = JSON.parse(localStorage.getItem("user") || "null");
  // Avgör roll
  const isAdmin = user?.role === "admin";
  const isUser = user?.role === "user";

  // Returnerar rätt header baserat på roll
  if (isAdmin) return <HeaderAdmin />;
  if (isUser) return <HeaderUser />;
  return <HeaderGuest />;
}
