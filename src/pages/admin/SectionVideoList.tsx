import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Pagination from "../../components/General/Pagination";

function SectionVideoList() {
  const { id } = useParams(); // sectionId
  const navigate = useNavigate();
  const [videos, setVideos] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 5;
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    fetchVideos();
  }, [id]);

  const fetchVideos = async () => {
    try {
      const res = await api.get(`/admin/sections/${id}/videos`);
      setVideos(res.data);
    } catch (err) {
      console.error("Fel vid hämtning av videor:", err);
      setError("Kunde inte hämta videor.");
    }
  };

  const startEditing = (video: any) => {
    setEditingId(video.id);
    setEditTitle(video.title);
    setEditDescription(video.description);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
  };

  const saveChanges = async (id: number) => {
    try {
      await api.put(`/admin/videos/${id}`, {
        title: editTitle,
        description: editDescription,
      });
      fetchVideos();
      cancelEditing();
    } catch (err) {
      console.error("Fel vid uppdatering:", err);
    }
  };

  const deleteVideo = async (id: number) => {
    if (!window.confirm("Är du säker på att du vill ta bort denna video?")) return;
    try {
      await api.delete(`/admin/videos/${id}`);
      fetchVideos();
    } catch (err) {
      console.error("Fel vid borttagning:", err);
    }
  };

  const paginated = videos.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(videos.length / ITEMS_PER_PAGE);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate("/admin/sections")}
        className="mb-6 mt-[100px] cursor-pointer text-sm text-blue-700 underline hover:text-blue-900"
      >
        ← Tillbaka till sektioner
      </button>

      <h2 className="text-2xl font-bold text-center mb-6">🎥 Videor i sektion #{id}</h2>
      {error && <p className="text-red-600 text-center">{error}</p>}

      {videos.length === 0 ? (
        <p className="text-center">Inga videor hittades för denna sektion.</p>
      ) : (
        <>
          <ul className="space-y-6">
            {paginated.map((v) => (
              <li key={v.id} className="bg-white border p-4 rounded shadow">
                {editingId === v.id ? (
                  <>
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="border px-2 py-1 rounded w-full mb-2"
                    />
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="border px-2 py-1 rounded w-full mb-2"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => saveChanges(v.id)} className="bg-yellow-300 cursor-pointer text-white px-4 py-1 rounded">
                        💾 Spara
                      </button>
                      <button onClick={cancelEditing} className="text-gray-600 cursor-pointer underline">
                        ❌ Avbryt
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold">{v.title}</h3>
                    <p className="text-sm text-gray-700">{v.description || "–"}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Nivå:</strong> {v.level} | <strong>Sektion:</strong> {v.section_name}
                    </p>
                    <div className="mt-2">
                      <video className="w-full max-w-md" controls>
                        <source src={v.video_url} type="video/mp4" />
                      </video>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Uppladdad: {new Date(v.uploaded_at).toLocaleString()}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <button onClick={() => startEditing(v)} className="bg-yellow-400 cursor-pointer text-white px-3 py-1 rounded">
                        ✏️ Redigera
                      </button>
                      <button
                        onClick={() => deleteVideo(v.id)}
                        className="bg-red-500 cursor-pointer text-white px-3 py-1 rounded"
                      >
                        🗑️ Radera
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPrev={() => setPage((p) => Math.max(p - 1, 1))}
              onNext={() => setPage((p) => Math.min(p + 1, totalPages))}
            />
          )}
        </>
      )}
    </div>
  );
}

export default SectionVideoList;