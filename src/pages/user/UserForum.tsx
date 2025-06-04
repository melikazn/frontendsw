import { useEffect, useState } from "react";
import api from "../../api/axios";
import AOS from "aos";
import "aos/dist/aos.css";
import Pagination from "../../components/General/Pagination";
import ForumPostForm from "../../components/Forum/ForumPostForm";
import ForumPostItem from "../../components/Forum/ForumPostItem";

function UserForum() {
  // State för inlägg, nytt inlägg, nytt svar och valt inlägg
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [newAnswer, setNewAnswer] = useState("");
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 3;

  // Initierar animationer och hämtar foruminlägg vid sidladdning
  useEffect(() => {
    AOS.init({ duration: 600, once: true });
    fetchPosts();
  }, []);

  // Hämtar alla inlägg + deras svar
  const fetchPosts = async () => {
    const res = await api.get("/users/forum");
    const postsWithAnswers = await Promise.all(
      res.data.results.map(async (post: any) => {
        try {
          const answerRes = await api.get(`/users/forum/${post.id}`);
          return { ...post, answers: answerRes.data.answers };
        } catch {
          return { ...post, answers: [] };
        }
      })
    );
    setPosts(postsWithAnswers);
  };

  // Hanterar nytt inlägg
  const handleCreate = async () => {
    if (!newPost.title || !newPost.content) return;
    await api.post("/users/forum", newPost);
    setNewPost({ title: "", content: "" });
    fetchPosts(); // Uppdatera listan
  };

  // Hanterar nytt svar på ett specifikt inlägg
  const handleAnswerSubmit = async (postId: number) => {
    if (!newAnswer.trim()) return;
    await api.post(`/users/forum/${postId}/answer`, { content: newAnswer });
    setNewAnswer("");
    setSelectedPostId(null);
    fetchPosts(); 
  };

  // Rösta upp eller ner ett inlägg
  const vote = async (postId: number, type: "like" | "dislike") => {
    try {
      await api.post(`/users/forum/${postId}/vote`, { type });
      fetchPosts();
    } catch {
      alert("Kunde inte registrera röst.");
    }
  };

  // pagination
  const totalPages = Math.ceil(posts.length / ITEMS_PER_PAGE);
  const paginatedPosts = posts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="max-w-screen-xl mt-[100px] mx-auto px-4 sm:px-6 lg:px-8 py-6 text-[#00296b] font-sans">
      {/* Titelillustration */}
      <img
        src="/images/forum.png"
        className="mx-auto my-6 max-w-[300px] w-full h-auto"
        alt="Teacher icon"
        data-aos="flip-left"
      />

      {/* Formulär för nytt inlägg */}
      <ForumPostForm newPost={newPost} setNewPost={setNewPost} onSubmit={handleCreate} />

      <hr className="my-10" />

      {/* Lista över befintliga inlägg */}
      <h3 className="text-2xl font-semibold mb-6">📋 Befintliga frågor</h3>
      <ul className="space-y-6">
        {paginatedPosts.map((post) => (
          <ForumPostItem
            key={post.id}
            post={post}
            selectedPostId={selectedPostId}
            setSelectedPostId={setSelectedPostId}
            newAnswer={newAnswer}
            setNewAnswer={setNewAnswer}
            onSubmitAnswer={handleAnswerSubmit}
            onVote={vote}
          />
        ))}
      </ul>

      {/* Paginering*/}
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

export default UserForum;
