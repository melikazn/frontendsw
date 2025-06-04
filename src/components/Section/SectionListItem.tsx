import { useNavigate } from "react-router-dom";

// Typdefinition för props som komponenten tar emot
interface Props {
  section: any; 
  onEdit: () => void; 
  onDelete: () => void; 
}

// Komponent som visar information om en sektion i listan
const SectionListItem = ({ section, onEdit, onDelete }: Props) => {
  const navigate = useNavigate(); 

  return (
    <li className="bg-white shadow rounded-lg p-5 border border-gray-200">
      
      {/* Titel, nivå och kategori */}
      <div className="text-sm sm:text-base font-medium text-gray-800 mb-2">
        <strong className="text-blue-800">{section.name}</strong> ({section.level}) – Kategori:
        <span className="text-gray-600"> {section.category_name}</span>
      </div>

      {/* Knappar för att hantera videor, tester, redigering och borttagning */}
      <div className="flex flex-wrap gap-2 mt-2">
        <button
          onClick={() => navigate(`/admin/sections/${section.id}/videos`)}
          className="bg-yellow-100 cursor-pointer text-yellow-800 px-3 py-1 rounded hover:bg-yellow-200 text-sm"
        >
          📹 Video
        </button>

        <button
          onClick={() => navigate(`/admin/sections/${section.id}/tests`)}
          className="bg-indigo-100 cursor-pointer text-indigo-800 px-3 py-1 rounded hover:bg-indigo-200 text-sm"
        >
          🧪 Test
        </button>

        <button
          onClick={onEdit}
          className="bg-blue-100 cursor-pointer text-blue-800 px-3 py-1 rounded hover:bg-blue-200 text-sm"
        >
          ✏️ Redigera
        </button>

        <button
          onClick={onDelete}
          className="bg-red-100 cursor-pointer text-red-700 px-3 py-1 rounded hover:bg-red-200 text-sm"
        >
          🗑 Ta bort
        </button>
      </div>
    </li>
  );
};

export default SectionListItem;
