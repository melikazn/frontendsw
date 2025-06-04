import api from "../../api/axios";
import { useState } from "react";

// Typdefinitioner
interface Answer {
  id: number;
  content: string;
  author: string;
  created_at: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
  likes: number;
  dislikes: number;
  answers: Answer[];
}

interface Props {
  post: Post;
  replyValue: string;
  setReplyValue: (val: string) => void;
  onReply: () => void;
  onVote: (type: "like" | "dislike") => void;
}

const ForumPostAdminItem = ({
  post,
  replyValue,
  setReplyValue,
  onReply,
  onVote,
}: Props) => {
  const [deleted, setDeleted] = useState(false);

  const handleDeleteClick = async () => {
    if (window.confirm("Vill du verkligen ta bort detta inlägg?")) {
      try {
        await api.delete(`/admin/forum/${post.id}`);
        setDeleted(true); // Visa inte längre inlägget
      } catch (err) {
        alert("Kunde inte ta bort inlägget.");
        console.error(err);
      }
    }
  };

  if (deleted) return null;

  return (
    <li className="bg-white shadow rounded-lg p-5 border border-gray-200">
      {/* Titel och metadata */}
      <h4 className="text-blue-800 font-semibold text-lg">{post.title}</h4>
      <p className="text-sm text-gray-600 mb-2">
        av {post.author} • {new Date(post.created_at).toLocaleString()}
      </p>

      {/* Innehåll */}
      <p className="mb-3">{post.content}</p>

      {/* Gilla/Ogilla-knappar */}
      <div className="flex gap-3 mb-3">
        <button
          onClick={() => onVote("like")}
          className="text-green-600 cursor-pointer"
        >
          👍 {post.likes}
        </button>
        <button
          onClick={() => onVote("dislike")}
          className="text-red-600 cursor-pointer"
        >
          👎 {post.dislikes}
        </button>
      </div>

      {/* Ta bort-knapp */}
      <div className="flex gap-4 text-sm">
        <button
          onClick={handleDeleteClick}
          className="text-red-600 cursor-pointer hover:underline"
        >
          🗑 Ta bort
        </button>
      </div>

      {/* Svarsfält */}
      <div className="mt-4">
        <textarea
          placeholder="Skriv ett svar..."
          value={replyValue}
          onChange={(e) => setReplyValue(e.target.value)}
          rows={2}
          className="w-full mb-2 px-4 py-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={onReply}
          className="bg-blue-600 text-white px-4 py-1 rounded cursor-pointer hover:bg-blue-700"
        >
          Svara
        </button>
      </div>

      {/* Lista över tidigare svar */}
      {post.answers.length > 0 && (
        <div className="mt-4 border-t pt-3 pl-3 border-gray-300">
          <strong className="text-sm text-gray-700">Svar:</strong>
          <ul className="list-disc pl-5 mt-2 space-y-2 text-sm text-gray-700">
            {post.answers.map((a) => (
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
  );
};

export default ForumPostAdminItem;
