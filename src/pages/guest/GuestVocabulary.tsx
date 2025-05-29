import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import Footer from "../../components/layouts/FooterGuest";
import HeaderGuest from "../../components/layouts/HeaderGuest";
import Pagination from "../../components/General/Pagination";

function GuestVocabulary() {
  const { level, letter } = useParams();
  const navigate = useNavigate();

  const [words, setWords] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [level, letter]);

  useEffect(() => {
    fetchWords();
  }, [level, letter, page]);

  const fetchWords = async () => {
    try {
      console.log("level:", level, "letter:", letter);

      const res = await api.get("/users/guestvocabulary", {
        params: { level, letter, page },
      });

      setWords(res.data.words);
      setTotalPages(res.data.totalPages);
      setError(null);
    } catch (err: any) {
      console.error("Fel vid hämtning av ord:", err);
      setWords([]);
      setError("Det gick inte att hämta ordlistan.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#00296b] font-sans">
      <HeaderGuest />
      <main className="flex-grow px-4 mt-[150px] py-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            📄 Ord på nivå {level} som börjar med {letter}
          </h2>

          <div className="text-center mb-6">
            <button
              onClick={() => navigate("/guestvocabulary")}
              className="inline-block bg-[#fdc500] text-[#00296b] px-6 py-2 rounded-full font-bold shadow-md hover:bg-[#ffe066] transition"
            >
              ⬅ Tillbaka till nivåval
            </button>
          </div>

          {error && <p className="text-red-600 text-center mb-4">{error}</p>}

          {words.length === 0 && !error ? (
            <p className="text-center text-gray-600">Inga ord hittades.</p>
          ) : (
            <>
              <ul className="space-y-3">
                {words.map((word) => (
                  <li
                    key={word.id}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <span
                      className="cursor-pointer text-blue-600 hover:underline text-lg"
                      onClick={() => navigate(`/guestvocabulary/detail/${word.id}`)}
                    >
                      <strong>{word.word}</strong>
                    </span>
                  </li>
                ))}
              </ul>

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onNext={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                onPrev={() => setPage((prev) => Math.max(prev - 1, 1))}
              />
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default GuestVocabulary;