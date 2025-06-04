// Props: lista med kategorier, valt ID och en funktion för att välja kategori
interface Props {
  categories: { id: number; name: string }[]; 
  selectedId: number | null;           
  onSelect: (id: number) => void;            
}

// Komponent som visar kategorier som klickbara knappar
const CategorySelector = ({ categories, selectedId, onSelect }: Props) => (
  <div className="flex flex-wrap gap-4 mt-3">
    {categories.map(cat => (
      <button
        key={cat.id}
        // Välj kategori
        onClick={() => onSelect(cat.id)} 
        className={`px-6 py-3 rounded-2xl shadow cursor-pointer text-base font-semibold ${
          selectedId === cat.id
            ? 'bg-blue-600 text-white'    
            : 'bg-yellow-300 text-gray-800'
        }`}
      >
        {cat.name}
      </button>
    ))}
  </div>
);

export default CategorySelector;
