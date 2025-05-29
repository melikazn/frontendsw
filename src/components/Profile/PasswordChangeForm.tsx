import { useState } from "react";
import api from "../../api/axios";

// Formulär för att byta lösenord
function PasswordChangeForm() {
  // Inmatningsfält
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  // Meddelanden och validering
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [isMatch, setIsMatch] = useState<boolean | null>(null);
  const [minLengthOk, setMinLengthOk] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasLowercase, setHasLowercase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);

  // Kontrollera om lösenordet uppfyller kraven
  const validatePasswordStrength = (password: string) => {
    setMinLengthOk(password.length >= 6);
    setHasUppercase(/[A-Z]/.test(password));
    setHasLowercase(/[a-z]/.test(password));
    setHasNumber(/[0-9]/.test(password));
  };

  // Hanterar lösenordsändring
  const handlePasswordChange = async () => {
    setIsMatch(newPassword === repeatPassword);

    // Validering av lösenordet
    if (!minLengthOk || !hasUppercase || !hasLowercase || !hasNumber) {
      setPasswordMessage("❌ Lösenordet uppfyller inte alla krav.");
      return;
    }

    if (newPassword !== repeatPassword) {
      setPasswordMessage("❌ Lösenorden matchar inte.");
      return;
    }

    try {
      await api.post("/users/change-password", {
        currentPassword,
        newPassword,
      });

      // Nollställ fält och visa framgångsmeddelande
      setPasswordMessage("✔️ Lösenordet har ändrats!");
      setCurrentPassword("");
      setNewPassword("");
      setRepeatPassword("");
      setMinLengthOk(false);
      setHasUppercase(false);
      setHasLowercase(false);
      setHasNumber(false);
      setIsMatch(null);
    } catch (err: any) {
      console.error("Fel vid lösenordsbyte", err);
      setPasswordMessage("❌ Misslyckades att byta lösenord.");
    }
  };

  // Stil för knappen
  const buttonStyle =
    "bg-[#fdc500] text-[#00296b] rounded-full px-6 py-2 text-base sm:text-lg font-bold shadow-lg transition-transform duration-300 hover:bg-[#ffe066] hover:scale-105 cursor-pointer";

  return (
    <div className="space-y-3" data-aos="fade-up">
      <h3 className="text-xl font-semibold mb-4">🔒 Byt lösenord</h3>

      {/* Fält: nuvarande lösenord */}
      <input
        type="password"
        placeholder="Nuvarande lösenord"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        className="block w-full h-[40px] px-4 border border-blue-400 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Fält: nytt lösenord med styrkevalidering */}
      <input
        type="password"
        placeholder="Nytt lösenord"
        value={newPassword}
        onChange={(e) => {
          setNewPassword(e.target.value);
          validatePasswordStrength(e.target.value);
          setIsMatch(e.target.value === repeatPassword);
        }}
        className={`block w-full h-[40px] px-4 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          minLengthOk && hasUppercase && hasLowercase && hasNumber
            ? "border-green-500"
            : "border-red-500"
        }`}
      />

      {/* Fält: repetera nytt lösenord */}
      <input
        type="password"
        placeholder="Repetera nya lösenordet"
        value={repeatPassword}
        onChange={(e) => {
          setRepeatPassword(e.target.value);
          setIsMatch(e.target.value === newPassword);
        }}
        className={`block w-full h-[40px] px-4 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          isMatch === null ? "" : isMatch ? "border-green-500" : "border-red-500"
        }`}
      />

      {/* Lista med krav och status för nytt lösenord */}
      <ul className="text-sm text-[#00296b] space-y-1 text-left pl-2">
        <li>{minLengthOk ? "✅" : "❌"} Minst 6 tecken</li>
        <li>{hasUppercase ? "✅" : "❌"} Minst en stor bokstav (A–Z)</li>
        <li>{hasLowercase ? "✅" : "❌"} Minst en liten bokstav (a–z)</li>
        <li>{hasNumber ? "✅" : "❌"} Minst en siffra (0–9)</li>
      </ul>

      {/* Skicka-knapp */}
      <button onClick={handlePasswordChange} className={buttonStyle}>
        Byt lösenord
      </button>

      {/* Statusmeddelande */}
      {passwordMessage && (
        <p className="mt-2 text-sm font-semibold">{passwordMessage}</p>
      )}
    </div>
  );
}

export default PasswordChangeForm;
