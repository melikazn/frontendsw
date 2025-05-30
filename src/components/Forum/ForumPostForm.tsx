interface Props {
  newPost: { title: string; content: string };
  setNewPost: (post: { title: string; content: string }) => void;
  onSubmit: () => void;
}

// Formulär för att skapa ett nytt foruminlägg
const ForumPostForm = ({ newPost, setNewPost, onSubmit }: Props) => {
  return (
    <div className="mb-10" data-aos="fade-up"> {/* AOS-animation vid scroll */}
      <h3 className="text-2xl font-semibold mb-3">➕ Skapa ny fråga</h3>

      {/* Titel-input */}
      <input
        placeholder="Titel"
        value={newPost.title}
        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
        className="w-full border border-gray-300 rounded px-4 py-3 mb-3 text-base"
      />

      {/* Innehålls-textarea */}
      <textarea
        placeholder="Innehåll"
        value={newPost.content}
        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
        rows={4}
        className="w-full border border-gray-300 rounded px-4 py-3 mb-3 resize-none text-base"
      />

      {/* Skicka-knapp */}
      <button
        onClick={onSubmit}
        className="bg-blue-600 cursor-pointer text-white px-6 py-2 rounded hover:bg-blue-700 transition w-full sm:w-auto font-semibold text-base"
      >
        Skapa
      </button>
    </div>
  );
};

export default ForumPostForm;
