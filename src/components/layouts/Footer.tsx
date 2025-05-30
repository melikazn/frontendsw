// Importerar de tre varianterna av footers
import FooterGuest from "./FooterGuest";
import FooterUser from "./FooterUser";
import FooterAdmin from "./FooterAdmin";

// Komponent som väljer rätt footer beroende på användarroll
export default function Footer() {
  // Hämtar användaren från localStorage 
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Kontrollera roll
  const isAdmin = user?.role === "admin";
  const isUser = user?.role === "user";

  // Rendera rätt footer beroende på roll
  if (isAdmin) return <FooterAdmin />;
  if (isUser) return <FooterUser />;
  return <FooterGuest />;
}
