import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Footer from "../../components/layouts/FooterGuest";
import HeaderGuest from "../../components/layouts/HeaderGuest";

function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const buttonStyle =
    "bg-[#fdc500] text-[#00296b] rounded-full px-6 py-2 text-base sm:text-lg font-bold shadow-lg transition-transform duration-300 hover:bg-[#ffe066] hover:scale-105 cursor-pointer";

  return (
    <div >
        <HeaderGuest />
      <div className="max-w-4xl mx-auto bg-white text-[#00296b] mt-[100px] font-sans px-4 sm:px-6 lg:px-10">

        {/* INTRO */}
        <section className="text-center py-10 mt-[]" data-aos="fade-up">
          <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4" data-aos="fade-down">
            Swedish for all
          </h1>
          <p className="text-sm md:text-base lg:text-lg xl:text-xl leading-relaxed px-4 sm:px-6 md:px-8 lg:px-12" data-aos="fade-up">
            Välkommen till vår onlineakademi med 9 års erfarenhet! Här kan du lära dig svenska både online och offline med moderna metoder. Vi erbjuder lektioner för alla nivåer, från A1 till C1!
          </p>
          <img
            src="/images/flag-splash.png"
            alt="Flag splash"
            className="mx-auto my-4 max-w-[300px] w-full h-auto pb-12"
            data-aos="zoom-in-up"
          />
        </section>

        {/* OFFLINE-KURSER */}
        <section className="text-center py-10" data-aos="fade-up">
          <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-2" data-aos="slide-up">
            Lär dig var<br />som helst när<br />som helst!
          </h2>
          <p className="text-sm md:text-base lg:text-lg xl:text-xl px-4 sm:px-6 md:px-8 lg:px-12 mb-4" data-aos="fade-right">
            Med våra offlinekurser kan du lära dig svenska i din egen takt – var som helst, när som helst! Som medlem hos oss får du tillgång till vårt stora videobibliotek, där du kan titta på videor om olika ämnen. Till varje video finns även ett test, så att du kan säkerställa att du har behärskat ämnet!
          </p>
          <div className="flex justify-center gap-4 flex-wrap" data-aos="zoom-in">
            <button onClick={() => navigate("/register")} className={buttonStyle}>
              Bli medlem!
            </button>
            <button onClick={() => navigate("/login")} className={buttonStyle}>
              Logga in!
            </button>
          </div>
          
        </section>

        {/* ONLINELEKTIONER */}
        <section className="text-center py-10" data-aos="flip-up">
          <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-2 pt-10" data-aos="fade-right">
            Ha en lärare hemma hos dig!
          </h2>
          <img
            src="/images/blackboard.png"
            className="mx-auto my-4 max-w-[200px] w-full h-auto"
            alt="Teacher icon"
            data-aos="flip-left"
          />
          <p className="text-sm md:text-base lg:text-lg xl:text-xl px-4 sm:px-6 md:px-8 lg:px-12 mb-4" data-aos="fade-left">
            Med våra onlinelektioner får du tillgång till riktiga lärare och allt läromaterial – helt gratis!
          </p>
          <button onClick={() => navigate("/kontakt")} className={buttonStyle} data-aos="zoom-in">
            Kontakta oss!
          </button>
        </section>

        {/* ORDBOK */}
        <section className="text-center py-10 pt-20" data-aos="zoom-in">
          <img
            src="/images/dictionary.png"
            alt="Ordbok"
            className="mx-auto max-w-[200px] w-full h-auto"
            data-aos="flip-up"
          />
          <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mt-2" data-aos="slide-right">
            Gratis ordbok!
          </h2>
          <p className="text-sm md:text-base lg:text-lg xl:text-xl mt-2 px-4 sm:px-6 md:px-8 lg:px-12" data-aos="fade-up">
            Upptäck vår gratis ordbok – alltid tillgänglig för dig!
          </p>
          <div className="mt-4 mb-16">
            <button
              onClick={() => navigate("/guestvocabulary")}
              className={buttonStyle}
              data-aos="zoom-in-up"
            >
              Ordbok!
            </button>
          </div>
        </section>


      </div>
              {/* FOOTER */}
        <Footer />
    </div>
  );
}

export default HomePage;
