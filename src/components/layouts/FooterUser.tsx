import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
  const navigate = useNavigate(); 

  return (
    <footer className="bg-[#004B94] text-[#fdc500] w-ful py-[30px] pt-10 pb-6 mt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Kontakt + Länkar */}
        <div className="grid md:grid-cols-3 gap-8 mb-8 text-sm">
          {/* LOGO + Kontaktinfo */}
          <div>
            <img
              src="/images/logo.png"
              alt="Logo"
              className="w-[120px] mb-4 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => navigate("/dashboard")}
            />
            <div className="flex items-center mb-2">
              <FaEnvelope className="mr-2" />
              <a href="mailto:swedishforall2025@gmail.com" className="hover:underline">
                swedishforall2025@gmail.com
              </a>
            </div>
            <div className="flex items-center mb-2">
              <FaPhone className="mr-2" />
              <span>0098910441548</span>
            </div>
            <div className="flex items-center">
              <FaMapMarkerAlt className="mr-2" />
              <span>Iran, Karaj, Shariati blv 35</span>
            </div>
          </div>

          {/* MENY */}
          <div className="flex flex-col md:items-center">
            <h3 className="font-bold text-lg mb-2">Navigering</h3>
            <span className="cursor-pointer hover:underline mb-1" onClick={() => navigate("/dashboard")}>
              Dashboard
            </span>
            <span className="cursor-pointer hover:underline mb-1" onClick={() => navigate("/dashboard/profile")}>
              Profile
            </span>
            <span className="cursor-pointer hover:underline" onClick={() => navigate("/")}>
              Logga ut
            </span>
          </div>

          {/* Info */}
          <div className="md:text-right">
            <h3 className="font-bold text-lg mb-2">Om oss</h3>
            <p className="text-[#fdc500]/90 text-sm leading-relaxed">
              Vi erbjuder svenskundervisning med passion och erfarenhet – för alla nivåer och mål!
            </p>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="border-t border-[#fdc500]/30 pt-4 text-center text-sm text-[#fdc500]/80">
          © 2025 Swedish for All. Alla rättigheter förbehållna.
        </div>
      </div>
    </footer>
  );
}

