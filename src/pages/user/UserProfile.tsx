import { useEffect, useState } from "react";
import api from "../../api/axios";

function UserProfile() {
  const [user, setUser] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [isMatch, setIsMatch] = useState<boolean | null>(null);

  const [minLengthOk, setMinLengthOk] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasLowercase, setHasLowercase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await api.get("/users/profile");
      setUser(res.data);
    } catch (err) {
      console.error("Kunde inte hämta användarinfo", err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("profileImage", selectedFile);

    try {
      await api.post("/users/profile/image", formData);
      setSelectedFile(null);
      fetchUserProfile();
    } catch (err) {
      console.error("Kunde inte ladda upp bild", err);
    }
  };

  const handleDeleteImage = async () => {
    try {
      await api.delete("/users/profile/image");
      fetchUserProfile();
    } catch (err) {
      console.error("Kunde inte ta bort bild", err);
    }
  };

  const validatePasswordStrength = (password: string) => {
    setMinLengthOk(password.length >= 6);
    setHasUppercase(/[A-Z]/.test(password));
    setHasLowercase(/[a-z]/.test(password));
    setHasNumber(/[0-9]/.test(password));
  };

  const handlePasswordChange = async () => {
    setIsMatch(newPassword === repeatPassword);

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
        newPassword
      });
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

  const getBorderStyle = (ok: boolean | null) => {
    if (ok === null) return {};
    return {
      border: `2px solid ${ok ? "green" : "red"}`
    };
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: "2rem", textAlign: "center" }}>
      <h2>Välkommen {user?.name || "Användare"}!</h2>

      {user?.profile_image ? (
        <div>
          <img
            src={`http://localhost:5050${user.profile_image}`}
            alt="Profilbild"
            style={{
              width: 150,
              height: 150,
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: "1rem"
            }}
          />
          <div>
            <button onClick={handleDeleteImage} style={{ marginRight: "1rem" }}>
              Ta bort bilden
            </button>
          </div>
        </div>
      ) : (
        <p>Ingen profilbild uppladdad.</p>
      )}

      <div style={{ marginTop: "1rem" }}>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={!selectedFile} style={{ marginTop: "0.5rem" }}>
          Ladda upp ny bild
        </button>
      </div>

      <hr style={{ margin: "2rem 0" }} />

      <h3>🔒 Byt lösenord</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "center" }}>
        <input
          type="password"
          placeholder="Nuvarande lösenord"
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Nytt lösenord"
          value={newPassword}
          onChange={e => {
            setNewPassword(e.target.value);
            validatePasswordStrength(e.target.value);
            setIsMatch(e.target.value === repeatPassword);
          }}
          style={getBorderStyle(minLengthOk && hasUppercase && hasLowercase && hasNumber)}
        />
        <input
          type="password"
          placeholder="Repetera nya lösenordet"
          value={repeatPassword}
          onChange={e => {
            setRepeatPassword(e.target.value);
            setIsMatch(e.target.value === newPassword);
          }}
          style={getBorderStyle(isMatch)}
        />

        {/* Checklistan */}
        <ul style={{ textAlign: "left", marginTop: "1rem", fontSize: "0.9rem" }}>
          <li>{minLengthOk ? "✅" : "❌"} Minst 6 tecken</li>
          <li>{hasUppercase ? "✅" : "❌"} Minst en stor bokstav (A–Z)</li>
          <li>{hasLowercase ? "✅" : "❌"} Minst en liten bokstav (a–z)</li>
          <li>{hasNumber ? "✅" : "❌"} Minst en siffra (0–9)</li>
        </ul>

        <button onClick={handlePasswordChange}>Byt lösenord</button>
        {passwordMessage && <p>{passwordMessage}</p>}
      </div>
    </div>
  );
}

export default UserProfile;
