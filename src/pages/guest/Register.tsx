import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api/auth";
import { toast } from "react-toastify";
import Footer from "../../components/layouts/FooterGuest";
import HeaderGuest from "../../components/layouts/HeaderGuest";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [minLengthOk, setMinLengthOk] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasLowercase, setHasLowercase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);

  const navigate = useNavigate();

  const validatePassword = (value: string) => {
    setPassword(value);
    setMinLengthOk(value.length >= 6);
    setHasUppercase(/[A-Z]/.test(value));
    setHasLowercase(/[a-z]/.test(value));
    setHasNumber(/[0-9]/.test(value));
  };

  const isFormValid =
    password === confirmPassword &&
    minLengthOk &&
    hasUppercase &&
    hasLowercase &&
    hasNumber;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    setLoading(true);

    if (!isFormValid) {
      toast.error("Lösenordet uppfyller inte kraven eller matchar inte.");
      setLoading(false);
      return;
    }

    try {
      await registerUser({ name: username, email, password });
      toast.success("Registrering lyckades! Du skickas till inloggningen.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      const message = err.response?.data?.message || "Registreringen misslyckades.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const buttonStyleBase =
    "rounded-full px-6 py-2 text-base sm:text-lg font-bold shadow-lg transition-transform duration-300 ";
  const buttonActive =
    "bg-[#fdc500] text-[#00296b] hover:bg-[#ffe066] hover:scale-105 cursor-pointer";
  const buttonInactive = "bg-gray-300 text-gray-500 cursor-not-allowed";
  const buttonStyle = `${buttonStyleBase} ${
    isFormValid && !loading ? buttonActive : buttonInactive
  }`;

  const inputStyle =
    "block w-full h-[40px] px-4 border border-blue-400 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="min-h-screen bg-white flex mt-[150px] flex-col justify-between">
        <HeaderGuest />
      <div className="flex justify-center items-center px-4 pt-10 pb-12">
        <div className="w-full max-w-sm p-6 bg-white shadow-xl rounded-xl text-center">

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#004B94] mb-2">
            Registrera dig idag
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-center mb-6 text-[#00296b] font-sans">
            Du kan bli medlem och få tillgång till hela videobiblioteket och alla tester!
            <br />
            Det kostar bara 1000 SEK – betala en gång och lär dig för alltid!
          </p>

          <img
            src="/images/register.png"
            alt="register"
            className="mx-auto max-w-[150px] w-full h-auto pb-6"
          />

          <form onSubmit={handleRegister} className="w-full space-y-4">
            <input
              type="text"
              placeholder="För- och Efternamn"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={inputStyle}
            />

            <input
              type="email"
              placeholder="E-postadress"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputStyle}
            />

            <input
              type="password"
              placeholder="Lösenord"
              value={password}
              onChange={(e) => validatePassword(e.target.value)}
              required
              className={inputStyle}
            />

            <input
              type="password"
              placeholder="Bekräfta lösenord"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={inputStyle}
            />

            {/* Lösenordskrav */}
            <ul className="text-sm text-[#00296b] space-y-1 text-left pl-2">
              <li>{minLengthOk ? "✅" : "❌"} Minst 6 tecken</li>
              <li>{hasUppercase ? "✅" : "❌"} Minst en stor bokstav (A–Z)</li>
              <li>{hasLowercase ? "✅" : "❌"} Minst en liten bokstav (a–z)</li>
              <li>{hasNumber ? "✅" : "❌"} Minst en siffra (0–9)</li>
            </ul>

            {/* Knapp */}
            <button type="submit" className={buttonStyle} disabled={!isFormValid || loading}>
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-[#00296b]"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                    ></path>
                  </svg>
                  Registrerar...
                </span>
              ) : (
                "Registrera"
              )}
            </button>

            {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Register;
