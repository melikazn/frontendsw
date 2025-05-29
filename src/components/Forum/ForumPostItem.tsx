// Definition av enskilt svar
interface Answer {
  id: number;
  content: string;
  author: string;
  created_at: string;
}

// Definition av ett foruminlägg
interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
  profile_image?: string;
  likes: number;
  dislikes: number;
  answers: Answer[];
}

// Props till komponenten
interface Props {
  post: Post;
  selectedPostId: number | null;
  setSelectedPostId: (id: number | null) => void;
  newAnswer: string;
  setNewAnswer: (text: string) => void;
  onSubmitAnswer: (postId: number) => void;
  onVote: (postId: number, type: "like" | "dislike") => void;
}

// Komponent som visar ett enskilt foruminlägg
const ForumPostItem = ({
  post,
  selectedPostId,
  setSelectedPostId,
  newAnswer,
  setNewAnswer,
  onSubmitAnswer,
  onVote,
}: Props) => {
  return (
    <li
      className="border border-gray-300 rounded p-6 shadow-sm hover:shadow-md transition"
      data-aos="fade-up" 
    >
      {/* Översta raden: profilbild + titel + metadata */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
        {post.profile_image && (
          <img
            src={`http://localhost:5050${post.profile_image}`}
            alt="Profilbild"
            className="w-12 h-12 rounded-full object-cover"
            onError={(e) => (e.currentTarget.style.display = "none")} 
          />
        )}
        <div>
          <strong className="text-lg">{post.title}</strong> – av {post.author}
          <br />
          <small className="text-gray-500">
            {new Date(post.created_at).toLocaleString()}
          </small>
        </div>
      </div>

      {/* Gilla/ogilla-knappar */}
      <div className="flex flex-wrap gap-4 mb-3 text-base">
        <button onClick={() => onVote(post.id, "like")} className="cursor-pointer">
          👍 {post.likes}
        </button>
        <button onClick={() => onVote(post.id, "dislike")} className="cursor-pointer">
          👎 {post.dislikes}
        </button>
      </div>

      {/* Knapp för att visa svarsfält */}
      <button
        onClick={() => setSelectedPostId(post.id)}
        className="text-blue-600 cursor-pointer mb-3 font-medium"
      >
        ✏️ Svara
      </button>

      {/* Svarsfält visas endast om detta inlägg är valt */}
      {selectedPostId === post.id && (
        <div className="mt-2">
          <textarea
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 mb-2 resize-none text-base"
            rows={3}
            placeholder="Skriv ditt svar här..."
          />
          <button
            onClick={() => onSubmitAnswer(post.id)}
            className="bg-green-600 text-white cursor-pointer px-6 py-2 rounded hover:bg-green-700 transition w-full sm:w-auto font-semibold"
          >
            Skicka svar
          </button>
        </div>
      )}

      {/* Visar befintliga svar om det finns några */}
      {post.answers && post.answers.length > 0 && (
        <div className="mt-5 pl-4 border-l-2 border-gray-300">
          <strong className="text-base">Svar:</strong>
          <ul className="mt-2 space-y-2">
            {post.answers.map((a) => (
              <li key={a.id} className="text-base">
                <p>{a.content}</p>
                <small className="text-gray-500">
                  av {a.author} – {new Date(a.created_at).toLocaleString()}
                </small>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
};

export default ForumPostItem;
