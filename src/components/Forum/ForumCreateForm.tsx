// Typdefinition för props
interface Props {
  newPost: { title: string; content: string }; // Innehåller titel och innehåll för det nya inlägget
  setNewPost: (val: { title: string; content: string }) => void; // Funktion för att uppdatera inläggsdata
  onSubmit: () => void; // Funktion som körs när användaren klickar på "skapa"
}

// Funktionell komponent för att skapa ett nytt forum-inlägg
const ForumCreateForm = ({ newPost, setNewPost, onSubmit }: Props) => (
  <div className="mb-6">
    {/* Rubrik */}
    <h3 className="text-lg font-semibold mb-2">➕ Skapa ny fråga</h3>

    {/* Inmatningsfält för titel */}
    <input
      placeholder="Titel"
      value={newPost.title}
      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
      className="w-full mb-2 px-4 py-2 border border-gray-300 rounded-md"
    />

    {/* Textfält för innehåll */}
    <textarea
      placeholder="Innehåll"
      value={newPost.content}
      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
      rows={3}
      className="w-full mb-2 px-4 py-2 border border-gray-300 rounded-md"
    />

    {/* Knapp för att skicka in formuläret */}
    <button
      onClick={onSubmit}
      className="bg-[#004B94] cursor-pointer text-white px-6 py-2 rounded hover:bg-blue-800"
    >
      Skapa
    </button>
  </div>
);

export default ForumCreateForm;
