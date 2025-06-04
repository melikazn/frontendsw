import { Listbox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";

// Typ för varje alternativ i dropdown-menyn
interface Option {
  value: string;
  label: string;
}

// Props till komponenten
interface Props {
  value: string;                     
  onChange: (value: string) => void;  
  options: Option[];                 
}

// Komponent för sorterings-dropdown
const SortDropdown = ({ value, onChange, options }: Props) => (
  <div className="w-60 relative z-10">
    <Listbox value={value} onChange={onChange}>
      {/* Knappen som visar nuvarande val */}
      <Listbox.Button className="relative w-full cursor-default rounded-xl border border-blue-400 bg-white py-2 pl-4 pr-10 text-left shadow-sm">
        <span className="block truncate">
          {options.find(o => o.value === value)?.label || "Välj"}
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <ChevronUpDownIcon className="h-5 w-5 text-blue-600" />
        </span>
      </Listbox.Button>

      {/* Alternativlista */}
      <Listbox.Options className="absolute mt-1 w-full rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 text-sm z-10">
        {options.map((option) => (
          <Listbox.Option
            key={option.value}
            value={option.value}
            className={({ active }) =>
              `cursor-pointer select-none px-4 py-2 ${
                active ? "bg-blue-100" : ""
              }`
            }
            aria-selected={option.value === value}
          >
            {option.label}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  </div>
);

export default SortDropdown;
