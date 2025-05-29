import { useState } from "react";

// Typdefinition för en sektion som innehåller tester
interface Section {
  id: number;
  name: string;
  level: string;
  tests: { id: number; title: string }[];
}

// Props: lista med sektioner, samt funktioner för val av sektion och start av test
interface Props {
  sections: Section[];
  onSelectSection: (sectionId: number) => void;
  onStartTest: (testId: number) => void;
}

// Komponent som visar sektioner med tillhörande tester
const SectionSelector = ({ sections, onSelectSection, onStartTest }: Props) => {
   // Håller koll på vilken sektion som är öppen
  const [openSectionId, setOpenSectionId] = useState<number | null>(null);

  // Öppna/stäng en sektion
  const toggleSection = (id: number) => {
     // Stäng om den redan är öppen
    setOpenSectionId(prev => (prev === id ? null : id));
    onSelectSection(id);
  };

  return (
    <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {sections.map((section) => (
        <li
          key={section.id}
          className="bg-gray-50 border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition"
        >
          {/* Sektionens namn (klickbar) */}
          <button
            onClick={() => toggleSection(section.id)}
            className="text-lg font-semibold text-left w-full"
          >
            {section.name} ({section.level})
          </button>

          {/* Om sektionen är öppen, visa dess tester */}
          {openSectionId === section.id && (
            <div className="mt-4">
              {section.tests && section.tests.length > 0 ? (
                <ul className="space-y-2">
                  {section.tests.map((test) => (
                    <li key={test.id} className="flex justify-between items-center">
                      <span>{test.title}</span>
                      <button
                        onClick={() => onStartTest(test.id)}
                        className="bg-yellow-400 hover:bg-yellow-300 text-[#00296b] cursor-pointer font-semibold py-1 px-3 rounded shadow"
                      >
                        🚀 Starta test
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                // Om inga tester finns
                <p className="text-sm text-gray-600">Inga test tillgängliga.</p>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default SectionSelector;
