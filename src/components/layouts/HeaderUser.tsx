import { useNavigate, useLocation } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { X } from "lucide-react";

// Användarmenyn för inloggade användare
export default function HeaderUser() {
  const [isOpen, setIsOpen] = useState(false);       
  const [isFadingOut, setIsFadingOut] = useState(false); 
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  // Logga ut användaren
  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // Navigera till en länk och stäng mobilmeny
  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  // Menylänkar
  const links = [
    { name: "Dashboard", to: "/dashboard" },
    { name: "Profile", to: "/dashboard/profile" },
    { name: "Ordförråd", to: "/dashboard/vocabulary" },
    { name: "Ordförråd-Quiz", to: "/dashboard/vocabulary-quiz" },
    { name: "FavoritOrd", to: "/dashboard/favorites" },
    { name: "Forum", to: "/dashboard/forum" },
    { name: "Meddelanden", to: "/dashboard/messages" },
    { name: "Testresultat", to: "/dashboard/results" },
    { name: "Tester", to: "/dashboard/tests" },
    { name: "Videor", to: "/dashboard/videos" },
    { name: "FavoritVideor", to: "/dashboard/favorites/videos" },
  ];

  // Förhindrar scroll när mobilmeny är öppen
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  // Animerad stängning av meny
  const closeMenu = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsFadingOut(false);
    }, 300);
  };

  // Stäng meny om man klickar utanför innehållet
  const handleMenuClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).tagName === "DIV") {
      closeMenu();
    }
  };

  // Avgör om en meny-länk är aktiv
  const isLinkActive = (linkTo: string) => {
    const current = location.pathname;
    if (linkTo === "/dashboard") return current === "/dashboard";
    if (linkTo === "/dashboard/favorites") return current === "/dashboard/favorites" || current.startsWith("/dashboard/favorites/word");
    if (linkTo === "/dashboard/favorites/videos") return current === "/dashboard/favorites/videos";
    if (linkTo === "/dashboard/vocabulary") return current === "/dashboard/vocabulary" || current.startsWith("/dashboard/vocabulary/");
    return current === linkTo || current.startsWith(linkTo + "/");
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 shadow-md bg-white fixed w-full z-50 top-0 left-0">
      {/* Logotyp */}
      <div className="flex items-center gap-8">
        <img
          src="/images/logo.png"
          alt="logo"
          className="h-[40px] w-auto cursor-pointer hover:animate-pulse transition-transform duration-300"
          onClick={() => handleNavigate("/dashboard")}
        />

        {/* Desktopmeny */}
        <ul className="hidden min-[1161px]:flex gap-6 font-medium">
          {links.map((link) => {
            const isActive = isLinkActive(link.to);

            return (
              <li
                key={link.name}
                className={`cursor-pointer relative transition-colors duration-300
                  ${isActive ? "text-[#fdc500]" : "text-[#00296b] hover:text-[#fdc500]"}
                  after:absolute after:left-0 after:bottom-[-3px] after:h-[2px]
                  after:bg-[#fdc500] after:transition-all after:duration-300
                  ${isActive ? "after:w-full" : "after:w-0 hover:after:w-full"}`}
                onClick={() => handleNavigate(link.to)}
              >
                {link.name}
              </li>
            );
          })}
          <li
            className="cursor-pointer relative text-[#00296b] hover:text-red-600 transition"
            onClick={logout}
          >
            Logga ut
          </li>
        </ul>
      </div>

      {/* Hamburgerikon*/}
      <div
        onClick={() => setIsOpen(true)}
        className="block min-[1161px]:hidden ml-auto cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00296b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </div>

      {/* Mobilmeny */}
      {isOpen && (
        <div
          ref={menuRef}
          className={`showMenuNav ${isFadingOut ? "animate-fade-out" : "animate-fade-in"}`}
          onClick={handleMenuClick}
        >
          <div
            className="absolute top-4 right-6 cursor-pointer text-3xl text-[#00296b] hover:text-[#fdc500] transition-transform duration-300 hover:rotate-90"
            onClick={closeMenu}
          >
            <X />
          </div>

          <ul className="flex flex-col items-center gap-6 text-[#00296b] font-semibold text-xl uppercase">
            {links.map((link, index) => {
              const isActive = isLinkActive(link.to);
              return (
                <li
                  key={link.name}
                  className={`cursor-pointer fade-in-menu-item transition-colors duration-300
                    ${isActive ? "text-[#fdc500]" : "hover:text-[#fdc500]"}`}
                  style={{ animationDelay: `${(index + 1) * 0.1}s` }}
                  onClick={() => handleNavigate(link.to)}
                >
                  {link.name}
                </li>
              );
            })}
            <li
              className="cursor-pointer hover:text-red-600 transition-colors fade-in-menu-item"
              onClick={logout}
            >
              Logga ut
            </li>
          </ul>
        </div>
      )}

      {/* CSS för mobilmenyanimation */}
      <style>{`
        .showMenuNav {
          position: fixed;
          width: 100%;
          height: 100vh;
          top: 0;
          left: 0;
          z-index: 50;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: rgba(255, 244, 214, 0.95);
          backdrop-filter: blur(8px);
          transform-origin: top;
        }

        @keyframes fadeInScaleDown {
          0% { opacity: 0; transform: translateY(-20px) scale(0.9); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes fadeOutScaleUp {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-20px) scale(0.9); }
        }

        @keyframes fadeInStaggered {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fadeInScaleDown 0.3s ease-out forwards;
        }

        .animate-fade-out {
          animation: fadeOutScaleUp 0.3s ease-out forwards;
        }

        .fade-in-menu-item {
          opacity: 0;
          animation: fadeInStaggered 0.4s ease-out forwards;
        }

        .fade-in-menu-item:nth-child(1) { animation-delay: 0.1s; }
        .fade-in-menu-item:nth-child(2) { animation-delay: 0.2s; }
        .fade-in-menu-item:nth-child(3) { animation-delay: 0.3s; }
        .fade-in-menu-item:nth-child(4) { animation-delay: 0.4s; }
        .fade-in-menu-item:nth-child(5) { animation-delay: 0.5s; }
        .fade-in-menu-item:nth-child(6) { animation-delay: 0.6s; }
        .fade-in-menu-item:nth-child(7) { animation-delay: 0.7s; }
        .fade-in-menu-item:nth-child(8) { animation-delay: 0.8s; }
        .fade-in-menu-item:nth-child(9) { animation-delay: 0.9s; }
        .fade-in-menu-item:nth-child(10) { animation-delay: 1.0s; }
        .fade-in-menu-item:nth-child(11) { animation-delay: 1.1s; }
      `}</style>
    </header>
  );
}
