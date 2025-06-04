interface Props {
  letters: string[];        
  selected: string;           
  onSelect: (letter: string) => void; 
}

// Komponent för att filtrera ord efter begynnelsebokstav
const LetterFilter = ({ letters, selected, onSelect }: Props) => (
  <div className="flex flex-wrap gap-2 mt-1">
    {letters.map(letter => (
      <button
        key={letter}
        onClick={() => onSelect(selected === letter ? "" : letter)} // Klick igen avmarkerar bokstaven
        className={`px-4 py-2 rounded-xl text-sm font-medium shadow 
          ${selected === letter 
            ? 'bg-blue-500 text-white'      // Om bokstaven är vald blir knappen bl[ 
            : 'bg-yellow-200 text-gray-800' // Annars gul knapp
          }`}
      >
        {letter}
      </button>
    ))}
  </div>
);

export default LetterFilter;
