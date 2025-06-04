import { useState } from "react";
import api from "../../api/axios";
import { User } from "../../types";

// Props: användarobjekt och callback-funktion för att uppdatera profilen
interface Props {
  user: User;
  onUpdate: () => void;
}

// Komponent för att visa, ladda upp och ta bort profilbild
function ProfileImageUpload({ user, onUpdate }: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showImage, setShowImage] = useState(false);      

  // Hanterar filval från input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Laddar upp vald bild till backend
  const handleUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("profileImage", selectedFile);
    try {
      await api.post("/users/profile/image", formData);
      setSelectedFile(null);
      onUpdate(); 
    } catch (err) {
      console.error("Kunde inte ladda upp bild", err);
    }
  };

  // Tar bort nuvarande profilbild
  const handleDeleteImage = async () => {
    try {
      await api.delete("/users/profile/image");
      onUpdate(); 
    } catch (err) {
      console.error("Kunde inte ta bort bild", err);
    }
  };

  return (
    <div>
      {/* Visar nuvarande profilbild om det finns en */}
      {user?.profile_image ? (
        <div className="flex flex-col items-center gap-2 mb-4">
          <img
            src={`http://localhost:5050${user.profile_image}`}
            alt="Profilbild"
            onClick={() => setShowImage(true)}
            className="w-24 h-40 object-cover rounded-xl border shadow cursor-pointer transition-transform hover:scale-105"
          />
          <button
            onClick={handleDeleteImage}
            className="text-sm text-red-500 cursor-pointer hover:text-red-700 bg-red-100 px-3 py-1 rounded-full transition-colors"
          >
            Ta bort bilden
          </button>
        </div>
      ) : (
        // Meddelande om ingen bild finns
        <p className="italic mb-4">📷 Ingen profilbild uppladdad.</p>
      )}

      {/* Filuppladdning */}
      <input
        type="file"
        onChange={handleFileChange}
        className="mb-2 w-full cursor-pointer"
      />
      <button
        onClick={handleUpload}
        disabled={!selectedFile}
        className="bg-blue-600 text-white px-4 py-2 rounded-full cursor-pointer hover:bg-blue-700 disabled:opacity-50 mb-8"
      >
        Ladda upp ny bild
      </button>

      {/* Fullskärmsvisning av profilbild */}
      {showImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
          <button
            onClick={() => setShowImage(false)}
            className="absolute top-6 right-6 text-white text-3xl font-bold cursor-pointer hover:text-red-500"
          >
            ❌
          </button>
          <img
            src={`http://localhost:5050${user?.profile_image}`}
            alt="Fullprofil"
            className="max-w-full max-h-full rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
}

export default ProfileImageUpload;
