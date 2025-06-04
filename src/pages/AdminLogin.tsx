import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import Footer from "../components/layouts/FooterGuest";
import HeaderGuest from "../components/layouts/HeaderGuest";

function AdminLogin() {
  // Lokala tillstånd för formuläret och felmeddelanden
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Funktion som hanterar inloggning när formuläret skickas in
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Återställ tidigare fel

    try {
      const res = await loginUser({ email, password });
      const { user, token } = res.data;

      // Kontrollera att användaren verkligen är admin
      if (user.role !== "admin") {
        setError("Det här är inte ett administratörskonto.");
        return;
      }

      // Spara användare och token i localStorage
      localStorage.setItem("user", JSON.stringify({ ...user, token }));
      localStorage.setItem("token", token);

      // Skicka vidare till adminpanelen
      navigate("/admin/dashboard");
    } catch (err: any) {
      // Visa felmeddelande om inloggningen misslyckas
      setError(err.response?.data?.message || "Fel vid inloggning.");
    }
  };

  // Stil för inloggningsknappen
  const buttonStyle =
    "bg-[#fdc500] text-[#00296b] rounded-full px-6 py-2 text-base sm:text-lg font-bold shadow-lg transition-transform duration-300 hover:bg-[#ffe066] hover:scale-105 cursor-pointer";

  return (
    <div className="bg-white text-[#00296b] min-h-screen mt-[100px] flex flex-col justify-between">
      {/* Gästheader */}
      <HeaderGuest />

      {/* Huvudinnehåll – inloggningsformulär */}
      <div className="flex justify-center items-center flex-grow px-4 pt-10">
        <div className="w-full max-w-sm p-6 bg-white shadow-md rounded-md text-center">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#004B94] mb-4">
            Admininloggning
          </h2>

          {/* Bild */}
          <img
            src="/images/login.png"
            alt="admin login"
            className="mx-auto my-2 max-w-[150px] w-full h-auto pb-6"
          />

          {/* Inloggningsformulär */}
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="E-postadress"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full h-[40px] px-4 border border-blue-400 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              placeholder="Lösenord"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full h-[40px] px-4 border border-blue-400 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button type="submit" className={buttonStyle}>
              Logga in
            </button>
          </form>

          {/* Felmeddelande */}
          {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
        </div>
      </div>

      {/* footer */}
      <Footer />
    </div>
  );
}

export default AdminLogin;
