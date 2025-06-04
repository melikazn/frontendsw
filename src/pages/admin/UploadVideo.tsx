import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import Dropdown from "../../components/General/Dropdown";

function UploadVideo() {
  // Tillstånd för sektioner och formulärfält
  const [sections, setSections] = useState<any[]>([]);
  const [selectedSection, setSelectedSection] = useState("none");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Tillstånd för fel, framgångsmeddelande och video-URL
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const navigate = useNavigate();

  // Hämta sektioner när komponenten laddas
  useEffect(() => {
    fetchSections();
  }, []);

  // API-anrop för att hämta alla sektioner
  const fetchSections = async () => {
    try {
      const res = await api.get("/admin/sections");
      setSections(res.data);
    } catch (err) {
      console.error("Fel vid hämtning av sektioner", err);
      setError("Kunde inte hämta sektioner.");
    }
  };

  // Hanterar formulärinlämning
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setVideoUrl(null);

    // Kontrollera att nödvändiga fält är ifyllda
    if (!title || !file) {
      setError("Titel och videofil krävs.");
      return;
    }

    // Skapa formData för filuppladdning
    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("sectionId", selectedSection);

    try {
      // Skicka uppladdning till backend
      const res = await api.post("/admin/videos/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Visa framgångsmeddelande och återställ formuläret
      setSuccess(res.data.message);
      setVideoUrl(res.data.video_url);
      setTitle("");
      setDescription("");
      setFile(null);
      setSelectedSection("none");

      // Omdirigera efter 3 sekunder
      setTimeout(() => navigate("/admin/videos"), 3000);
    } catch (err: any) {
      console.error("Fel vid uppladdning", err);
      setError(err.response?.data?.message || "Fel vid uppladdning.");
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 mt-[100px] mb-20">
      {/* Sidrubrik */}
      <h2 className="text-2xl font-bold text-[#004B94] mb-6 text-center">
        🎥 Ladda upp video
      </h2>

      {/* Visar felmeddelande vid problem */}
      {error && (
        <p className="mb-4 text-sm font-medium text-center text-red-800 bg-red-100 px-4 py-2 rounded shadow">
          {error}
        </p>
      )}

      {/* Visar bekräftelse efter uppladdning */}
      {success && (
        <p className="mb-4 text-sm font-medium text-center text-green-800 bg-green-100 px-4 py-2 rounded shadow">
          {success}
        </p>
      )}

      {/* Själva formuläret */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 space-y-5"
      >
        {/* Titel */}
        <div>
          <label className="block text-sm font-semibold mb-1">Titel:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="T.ex. Verb i presens"
          />
        </div>

        {/* Beskrivning */}
        <div>
          <label className="block text-sm font-semibold mb-1">Beskrivning:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Kort beskrivning av videons innehåll"
            rows={3}
          />
        </div>

        {/* Filinmatning */}
        <div>
          <label className="block text-sm font-semibold mb-1">Videofil:</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
            className="w-full border border-gray-300 rounded-md py-2 px-3 bg-gray-50"
          />
        </div>

        {/* Sektion */}
        <div>
          <label className="block text-sm font-semibold mb-1">Välj sektion:</label>
          <Dropdown
            selected={selectedSection}
            onChange={(val) => setSelectedSection(val)}
            options={[
              { value: "none", label: "Övrigt (ingen sektion)" },
              ...sections.map((s: any) => ({
                value: s.id,
                label: `${s.name} (${s.level})`,
              })),
            ]}
          />
        </div>

        {/* Knapp */}
        <div className="text-right">
          <button
            type="submit"
            className="bg-[#004B94] cursor-pointer text-white font-bold px-6 py-2 rounded hover:bg-blue-800 transition w-full sm:w-auto"
          >
            ⬆️ Ladda upp video
          </button>
        </div>
      </form>

      {/* Förhandsvisning efter uppladdning */}
      {videoUrl && (
        <div className="mt-10">
          <h4 className="text-lg font-semibold mb-2">🎬 Förhandsvisning:</h4>
          <video
            src={videoUrl}
            className="w-full rounded-md shadow"
            height="360"
            controls
          />
        </div>
      )}
    </div>
  );
}

export default UploadVideo;
