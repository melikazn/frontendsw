import { useParams, useNavigate } from "react-router-dom";

function UserVocabularyAlphabetPage() {
  const { level } = useParams();
  const navigate = useNavigate();

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ".split("");

  return (
    <div className="min-h-screen flex mt-[100px] flex-col bg-white text-[#00296b] font-sans">
      <main className="flex-grow mt-[100px] text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">
          🔤 Välj en bokstav för nivå {level}
        </h2>

        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {alphabet.map((letter) => (
            <button
              key={letter}
              onClick={() => navigate(`/dashboard/vocabulary/${level}/${letter}`)}
              className="w-14 cursor-pointer h-14 sm:w-16 sm:h-16 text-lg sm:text-xl font-semibold border border-gray-300 rounded-lg bg-gray-50 hover:bg-[#fdc500] hover:text-[#00296b] transition-colors shadow-sm"
            >
              {letter}
            </button>
          ))}
        </div>

        <button
          onClick={() => navigate("/dashboard/vocabulary")}
          className="mt-10 cursor-pointer bg-[#fdc500] text-[#00296b] px-6 py-2 rounded-full font-bold shadow-md hover:bg-[#ffe066] transition"
        >
          ⬅ Tillbaka
        </button>
      </main>
    </div>
  );
}

export default UserVocabularyAlphabetPage;