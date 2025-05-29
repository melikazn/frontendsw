import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

function AdminForumPost() {
  const { postId } = useParams();
  const [post, setPost] = useState<any>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const res = await api.get(`/admin/forum/${postId}`);
      setPost(res.data.post);
      setAnswers(res.data.answers);
    } catch (err) {
      setMessage("Kunde inte hämta frågan.");
    }
  };

  const handleSubmit = async () => {
    if (!newAnswer.trim()) return;
    try {
      await api.post(`/admin/forum/${postId}/answer`, { content: newAnswer });
      setNewAnswer("");
      fetchPost();
    } catch {
      setMessage("Kunde inte spara svaret.");
    }
  };

  const handleDeleteAnswer = async (id: number) => {
    if (!window.confirm("Vill du ta bort detta svar?")) return;
    try {
      await api.delete(`/admin/forum/answer/${id}`);
      fetchPost();
    } catch {
      setMessage("Kunde inte ta bort svaret.");
    }
  };

  if (!post) return <p>Laddar...</p>;

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: "2rem" }}>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <small>av {post.author} – {new Date(post.created_at).toLocaleString()}</small>

      <hr />
      <h3>🗨 Koskesh Svar</h3>
      {answers.length === 0 && <p>Inga svar ännu.</p>}
      <ul>
        {answers.map(a => (
          <li key={a.id} style={{ marginBottom: "1rem" }}>
            <p>{a.content}</p>
            <small>av {a.author} – {new Date(a.created_at).toLocaleString()}</small><br />
            <button onClick={() => handleDeleteAnswer(a.id)} style={{ color: "red", marginTop: "0.25rem" }}>
              🗑 Ta bort svar
            </button>
          </li>
        ))}
      </ul>

      <hr />
      <h3>✏️ Svara på frågan</h3>
      <textarea
        rows={4}
        style={{ width: "100%", marginBottom: "0.5rem" }}
        value={newAnswer}
        onChange={(e) => setNewAnswer(e.target.value)}
      />
      <button onClick={handleSubmit}>Skicka svar</button>
      {message && <p style={{ color: "red" }}>{message}</p>}
    </div>
  );
}

export default AdminForumPost;
