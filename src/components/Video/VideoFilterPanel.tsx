import SortDropdown from "./SortDropdown";
import LetterFilter from "./LetterFilter";

// Typdefinition för props
interface Props {
  search: string;                               
  onSearchChange: (val: string) => void;       
  sort: string;                                
  onSortChange: (val: string) => void;          
  sortOptions: { value: string; label: string }[];
  letters: string[];                      
  letterFilter: string;                        
  onLetterSelect: (letter: string) => void;  
}

// Komponent för filterpanel till videosidan
const VideoFilterPanel = ({
  search,
  onSearchChange,
  sort,
  onSortChange,
  sortOptions,
  letters,
  letterFilter,
  onLetterSelect,
}: Props) => (
  <div className="mb-6 space-y-4 mt-6">
    {/* Sökfält */}
    <input
      type="text"
      placeholder="🔍 Sök efter titel..."
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
      className="w-full sm:w-2/3 border border-gray-300 rounded px-4 py-2"
    />

    {/* Bokstavsfilter */}
    <div>
      <strong>Filtrera bokstav:</strong>
      <LetterFilter
        letters={letters}
        selected={letterFilter}
        onSelect={onLetterSelect}
      />
    </div>

    {/* Sorteringsdropdown */}
    <SortDropdown
      value={sort}
      onChange={onSortChange}
      options={sortOptions}
    />
  </div>
);

export default VideoFilterPanel;
