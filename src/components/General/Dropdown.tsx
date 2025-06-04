// Headless UI-komponenter för tillgänglighetsanpassad dropdown och animation
import { Listbox, Transition } from "@headlessui/react";
// Ikon för att indikera dropdown-pil
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
// Fragment används för att wrappa Transition utan extra HTML-element
import { Fragment } from "react";

// Typ för varje alternativ i dropdown-menyn
interface Option {
  label: string;
  value: string;
}

// Props för återanvändbar dropdown
interface Props {
  label?: string;                        
  options: Option[];                    
  selected: string;                   
  onChange: (value: string) => void;  
  className?: string;                  
}

// Dropdown-komponent
const Dropdown = ({ label, options, selected, onChange, className = "" }: Props) => {
  return (
    <div className={`relative w-full sm:w-64 ${className}`}>
      {/* Etikett visas om angiven */}
      {label && (
        <label className="block mb-1 font-medium text-sm text-[#00296b]">
          {label}
        </label>
      )}

      {/* Dropdown-knappen */}
      <Listbox value={selected} onChange={onChange}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-default rounded border border-blue-400 bg-white py-2 pl-4 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
            {/* Visar den valda etiketten, eller fallback-text */}
            <span className="block truncate">
              {options.find((opt) => opt.value === selected)?.label || "Välj..."}
            </span>
            {/* Pilen till höger */}
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <ChevronUpDownIcon className="h-5 w-5 text-blue-600" />
            </span>
          </Listbox.Button>

          {/* Menyn som visas vid klick */}
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 w-full cursor-pointer rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-sm">
              {options.map((opt) => (
                <Listbox.Option
                  key={opt.value}
                  value={opt.value}
                  className={({ active }) =>
                    `px-4 py-2 ${
                      active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                    }`
                  }
                >
                  {opt.label}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default Dropdown;
