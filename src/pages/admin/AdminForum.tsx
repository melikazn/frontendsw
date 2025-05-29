import { useEffect, useState } from "react";
import api from "../../api/axios";
import SearchInput from "../../components/General/SearchInput";
import Pagination from "../../components/General/Pagination";

function AdminForum() {
  const [posts, setPosts] = useState<any[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [replyInputs, setReplyInputs] = useState<{ [key: number]: string }>({});
  const postsPerPage = 5;


  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    applySearchFilter();
  }, [posts, searchTerm]);

  const fetchPosts = async () => {
    const res = await api.get("/admin/forum");
    setPosts(res.data.results);
  };

  const applySearchFilter = () => {
    const filtered = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(filtered);
    setCurrentPage(1);
  };

  const handleCreate = async () => {
    if (!newPost.title || !newPost.content) return;
    await api.post("/admin/forum", newPost);
    setNewPost({ title: "", content: "" });
    fetchPosts();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Ta bort denna fråga?")) return;
    await api.delete(`/admin/forum/${id}`);
    fetchPosts();
  };

  const vote = async (postId: number, type: "like" | "dislike") => {
    try {
      await api.post(`/admin/forum/${postId}/vote`, { type });
      fetchPosts();
    } catch {
      alert("Kunde inte registrera röst.");
    }
  };

  const handleReply = async (postId: number) => {
    const content = replyInputs[postId];
    if (!content?.trim()) return;

    await api.post(`/admin/forum/${postId}/answer`, { content });
    setReplyInputs((prev) => ({ ...prev, [postId]: "" }));
    fetchPosts();
  };

  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  return (
    <div className="max-w-4xl mx-auto px-4 mt-[150px] mb-20">
      <h2 className="text-2xl font-bold text-[#004B94] mb-4">💬 Forumfrågor</h2>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">➕ Skapa ny fråga</h3>
        <input
          placeholder="Titel"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          className="w-full mb-2 px-4 py-2 border border-gray-300 rounded-md"
        />
        <textarea
          placeholder="Innehåll"
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          rows={3}
          className="w-full mb-2 px-4 py-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={handleCreate}
          className="bg-[#004B94] cursor-pointer text-white px-6 py-2 rounded hover:bg-blue-800"
        >
          Skapa
        </button>
      </div>

      <SearchInput
        query={searchTerm}
        onChange={setSearchTerm}
        onSearch={applySearchFilter}
        onClear={() => setSearchTerm("")}
      />

      <h3 className="text-lg font-semibold mb-6 mt-8">📋 Befintliga frågor</h3>

      <ul className="space-y-6">
        {currentPosts.map((post) => (
          <li key={post.id} className="bg-white shadow rounded-lg p-5 border border-gray-200">
            <h4 className="text-blue-800 font-semibold text-lg">{post.title}</h4>
            <p className="text-sm text-gray-600 mb-2">av {post.author} • {new Date(post.created_at).toLocaleString()}</p>
            <p className="mb-3">{post.content}</p>

            <div className="flex gap-3 mb-3">
              <button onClick={() => vote(post.id, "like")} className="text-green-600 cursor-pointer">
                👍 {post.likes}
              </button>
              <button onClick={() => vote(post.id, "dislike")} className="text-red-600 cursor-pointer">
                👎 {post.dislikes}
              </button>
            </div>

            <div className="flex gap-4 text-sm">
              <button
                onClick={() => handleDelete(post.id)}
                className="text-red-600 cursor-pointer hover:underline"
              >
                🗑 Ta bort
              </button>
            </div>

            <div className="mt-4">
              <textarea
                placeholder="Skriv ett svar..."
                value={replyInputs[post.id] || ""}
                onChange={(e) => setReplyInputs({ ...replyInputs, [post.id]: e.target.value })}
                rows={2}
                className="w-full mb-2 px-4 py-2 border border-gray-300 rounded-md"
              />
              <button
                onClick={() => handleReply(post.id)}
                className="bg-blue-600 text-white px-4 py-1 rounded cursor-pointer hover:bg-blue-700"
              >
                Svara
              </button>
            </div>

            {post.answers?.length > 0 && (
              <div className="mt-4 border-t pt-3 pl-3 border-gray-300">
                <strong className="text-sm text-gray-700">Svar:</strong>
                <ul className="list-disc pl-5 mt-2 space-y-2 text-sm text-gray-700">
                  {post.answers.map((a: any) => (
                    <li key={a.id}>
                      <p>{a.content}</p>
                      <p className="text-xs text-gray-500">
                        av {a.author} • {new Date(a.created_at).toLocaleString()}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
        />
      )}
    </div>
  );
}

export default AdminForum;
