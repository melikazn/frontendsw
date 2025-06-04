// Props: nuvarande sida, totalt antal sidor och funktioner för att gå fram/bakåt
interface Props {
  currentPage: number;
  totalPages: number;
  onNext: () => void;
  onPrev: () => void;
}

// Paginering för att bläddra mellan sidor
const Pagination = ({ currentPage, totalPages, onNext, onPrev }: Props) => {
  return (
    <div className="flex justify-center items-center gap-4 mt-6">
      {/* Knapp för att gå till föregående sida, inaktiverad på första sidan */}
      <button
        onClick={onPrev}
        disabled={currentPage === 1}
        className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded disabled:opacity-50"
      >
        ◀ Föregående
      </button>

      {/* Visar aktuell sida av totalt antal sidor */}
      <span className="text-sm font-medium text-gray-700">
        Sida {currentPage} av {totalPages}
      </span>

      {/* Knapp för att gå till nästa sida, inaktiverad på sista sidan */}
      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded disabled:opacity-50"
      >
        Nästa ▶
      </button>
    </div>
  );
};

export default Pagination;
