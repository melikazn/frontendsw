import { useEffect, useState } from "react";
import api from "../../api/axios";
import AOS from "aos";
import "aos/dist/aos.css";
import Pagination from "../../components/General/Pagination";
import ForumCreateForm from "../../components/Forum/ForumCreateForm";
import ForumPostAdminItem from "../../components/Forum/ForumPostAdminItem";

function AdminForum() {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [replyInputs, setReplyInputs] = useState<{ [key: number]: string }>({});
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 3;

  // Initierar animationer och hämtar forumdata
  useEffect(() => {
    AOS.init({ duration: 600, once: true });
    fetchPosts();
  }, []);

  // Hämtar alla inlägg + tillhörande svar
  const fetchPosts = async () => {
    try {
      const res = await api.get("/admin/forum");
      const postsWithAnswers = await Promise.all(
        res.data.results.map(async (post: any) => {
          try {
            const answerRes = await api.get(`/admin/forum/${post.id}`);
            return { ...post, answers: answerRes.data.answers || [] };
          } catch {
            return { ...post, answers: [] };
          }
        })
      );
      setPosts(postsWithAnswers);
    } catch (err) {
      console.error("Kunde inte hämta foruminlägg", err);
    }
  };

  // Skapar nytt inlägg
  const handleCreate = async () => {
    if (!newPost.title || !newPost.content) return;
    try {
      await api.post("/admin/forum", newPost);
      setNewPost({ title: "", content: "" });
      fetchPosts();
    } catch (err) {
      console.error("Kunde inte skapa nytt inlägg", err);
    }
  };

  // Skickar svar på inlägg
  const handleReply = async (postId: number) => {
    const content = replyInputs[postId];
    if (!content?.trim()) return;
    try {
      await api.post(`/admin/forum/${postId}/answer`, { content });
      setReplyInputs((prev) => ({ ...prev, [postId]: "" }));
      fetchPosts();
    } catch (err) {
      console.error("Kunde inte skicka svar", err);
    }
  };

  // Röstar på inlägg
  const vote = async (postId: number, type: "like" | "dislike") => {
    try {
      await api.post(`/admin/forum/${postId}/vote`, { type });
      fetchPosts();
    } catch (err) {
      alert("Kunde inte registrera röst.");
    }
  };

  // Tar bort inlägg efter bekräftelse
  const handleDelete = async (postId: number) => {
    if (!window.confirm("Vill du verkligen ta bort detta inlägg?")) return;
    try {
      await api.delete(`/admin/forum/${postId}`);
      fetchPosts();
    } catch (err) {
      alert("Kunde inte ta bort inlägget.");
    }
  };

  // Beräknar och visar endast inlägg för aktuell sida
  const totalPages = Math.ceil(posts.length / ITEMS_PER_PAGE);
  const paginatedPosts = posts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="max-w-screen-xl mt-[100px] mx-auto px-4 sm:px-6 lg:px-8 py-6 text-[#00296b] font-sans">
      {/* Rubrikbild */}
      <img
        src="/images/forum.png"
        className="mx-auto my-6 max-w-[300px] w-full h-auto"
        alt="Teacher icon"
        data-aos="flip-left"
      />

      {/* Formulär för att skapa nytt inlägg */}
      <ForumCreateForm newPost={newPost} setNewPost={setNewPost} onSubmit={handleCreate} />

      <hr className="my-10" />

      {/* Lista med befintliga forumfrågor */}
      <h3 className="text-2xl font-semibold mb-6">📋 Befintliga frågor</h3>
      <ul className="space-y-6">
        {paginatedPosts.map((post) => (
          <ForumPostAdminItem
            key={post.id}
            post={post}
            replyValue={replyInputs[post.id] || ""}
            setReplyValue={(val) => setReplyInputs((prev) => ({ ...prev, [post.id]: val }))}
            onReply={() => handleReply(post.id)}
            onDelete={() => handleDelete(post.id)}
            onVote={(type) => vote(post.id, type)}
          />
        ))}
      </ul>

      {/* Sidnavigering */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onNext={() => setPage((p) => Math.min(p + 1, totalPages))}
          onPrev={() => setPage((p) => Math.max(p - 1, 1))}
        />
      )}
    </div>
  );
}

export default AdminForum;
