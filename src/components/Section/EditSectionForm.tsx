import LevelSelector from "../Selector/LevelSelector";

// Gränssnitt för de props som komponenten tar emot
interface Props {
  editForm: { name: string; level: string }; 
  onChange: (field: string, value: string) => void; 
  onSave: () => void; 
  onCancel: () => void; 
}

// Formulärkomponent för att redigera en sektion
const EditSectionForm = ({ editForm, onChange, onSave, onCancel }: Props) => {
  return (
    // Flexbox-layout som är responsiv: kolumn på mobil, rad på större skärmar
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      
      {/* Inmatning för sektionsnamn */}
      <input
        value={editForm.name}
        onChange={(e) => onChange("name", e.target.value)}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-md w-full"
      />

      {/* Dropdown för att välja CEFR-nivå (A1–C1) */}
      <LevelSelector
        level={editForm.level}
        onChange={(lvl) => onChange("level", lvl)}
        showAllOption={false} 
      />

      {/* Spara och Avbryt-knappar */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={onSave}
          className="bg-yellow-400 text-white px-4 py-1 rounded cursor-pointer hover:bg-yellow-300"
        >
          📂 Spara
        </button>
        <button
          onClick={onCancel}
          className="bg-blue-400 cursor-pointer text-gray-800 px-4 py-1 rounded hover:bg-blue-300"
        >
          ❌ Avbryt
        </button>
      </div>
    </div>
  );
};

export default EditSectionForm;
