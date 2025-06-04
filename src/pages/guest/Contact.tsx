import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import Footer from "../../components/layouts/FooterGuest";
import HeaderGuest from "../../components/layouts/HeaderGuest";

function Contact() {
  return (
    <div className="min-h-screen bg-white text-[#00296b]  mt-[150px] l  font-sans">
        <HeaderGuest />
      <div className="max-w-4xl mb-[500px] mx-auto bg-white p-6 sm:p-10 rounded-xl shadow-md flex flex-col lg:flex-row gap-8 items-center">
        
        {/* Bild */}
        <div className="w-full lg:w-1/2">
          <img
            src="/images/contact.png"
            alt="Kontakt"
            className="w-full h-auto max-w-sm mx-auto lg:mx-0 rounded-lg shadow"
          />
        </div>

        {/* Kontaktinfo */}
        <div className="w-full g:w-1/2">
          <h2 className="text-2xl sm:text-3xl font-bold text-center lg:text-left mb-6">
            📞 Kontakta oss
          </h2>

          <div className="space-y-6 text-sm sm:text-base lg:text-lg">
            <div className="flex items-start gap-3">
              <FaPhone className="text-xl sm:text-2xl text-[#fdc500] mt-1" />
              <span><strong>Telefon:</strong> 0098910441548</span>
            </div>

            <div className="flex items-start gap-3">
              <FaEnvelope className="text-xl sm:text-2xl text-[#fdc500] mt-1" />
              <span><strong>E-post:</strong> swedishforall2025@gmail.com</span>
            </div>

            <div className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-xl sm:text-2xl text-[#fdc500] mt-1" />
              <span><strong>Adress:</strong> Iran, Karaj, Shariati blv 35</span>
            </div>
          </div>
        </div>
      </div>
                  {/* FOOTER */}
                  <Footer />
    </div>
  );
}

export default Contact;
