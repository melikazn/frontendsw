import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";

// Props: filterstatus och sökfältets värde samt tillhörande setter-funktioner
interface Props {
  filterBySender: string;
  setFilterBySender: (value: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

// Komponent för att filtrera meddelanden via dropdown och sökfält
const MessageFilterBar = ({
  filterBySender,
  setFilterBySender,
  searchTerm,
  setSearchTerm,
}: Props) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
      
      {/* Dropdown för att välja avsändartyp */}
      <Listbox value={filterBySender} onChange={setFilterBySender}>
        <div className="relative w-full sm:w-64">
          <Listbox.Button className="relative w-full cursor-pointer rounded border border-blue-400 bg-white py-2 pl-4 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-base">
            {/* Visar valt alternativ */}
            <span className="block truncate">
              {filterBySender === "all"
                ? "Alla avsändare"
                : filterBySender === "admin"
                ? "Endast från Admin"
                : "Endast skickade"}
            </span>
            {/* Dropdown-ikon */}
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <ChevronUpDownIcon className="h-5 w-5 text-blue-600" />
            </span>
          </Listbox.Button>

          {/* Alternativen i dropdown-menyn */}
          <Listbox.Options className="absolute z-10 mt-1 w-full cursor-pointer rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-base">
            <Listbox.Option value="all" className="cursor-pointer px-4 py-2 hover:bg-blue-100">
              Alla avsändare
            </Listbox.Option>
            <Listbox.Option value="admin" className="cursor-pointer px-4 py-2 hover:bg-blue-100">
              Endast från Admin
            </Listbox.Option>
            <Listbox.Option value="user" className="cursor-pointer px-4 py-2 hover:bg-blue-100">
              Endast skickade
            </Listbox.Option>
          </Listbox.Options>
        </div>
      </Listbox>

      {/* Sökfält för ämne */}
      <input
        type="text"
        placeholder="🔍 Sök ämne..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full sm:w-64 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
      />
    </div>
  );
};

export default MessageFilterBar;
