import { useNavigate, useLocation } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { X } from "lucide-react";

export default function HeaderGuest() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const closeMenu = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsFadingOut(false);
    }, 300);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).tagName === "DIV") {
      closeMenu();
    }
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  const menuItems = [
    { name: "Hemsidan", to: "/" },
    { name: "Logga in", to: "/login" },
    { name: "Bli medlem", to: "/register" },
    { name: "Ordbok", to: "/guestvocabulary" },
    { name: "Kontakta oss", to: "/kontakt" },
  ];

  return (
    <div className="flex items-center justify-between px-6 py-4 shadow-md bg-white fixed w-full z-50 top-0 left-0">
      <div className="flex items-center gap-8">
        <img
          src="/images/logo.png"
          alt="logo"
          className="h-[40px] w-auto cursor-pointer hover:animate-pulse transition-transform duration-300"
          onClick={() => handleNavigate("/")}
        />

        {/* DESKTOPMENY */}
        <ul className="hidden min-[811px]:flex gap-8 font-medium">
          {menuItems.map((item) => {
            const isActive =
              item.to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.to);
            return (
              <li
                key={item.name}
                className={`cursor-pointer relative transition-colors duration-300
                  ${isActive ? "text-[#fdc500]" : "text-[#00296b] hover:text-[#fdc500]"}
                  after:absolute after:left-0 after:bottom-[-3px] after:h-[2px]
                  after:bg-[#fdc500] after:transition-all after:duration-300
                  ${isActive ? "after:w-full" : "after:w-0 hover:after:w-full"}`}
                onClick={() => handleNavigate(item.to)}
              >
                {item.name}
              </li>
            );
          })}
        </ul>
      </div>

      {/* HAMBURGERIKON */}
      <div
        onClick={() => setIsOpen(true)}
        className="block min-[811px]:hidden ml-auto cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#00296b"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </div>

      {/* MOBILMENY OVERLAY */}
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

          {/* MOBILMENY */}
          <ul className="flex flex-col items-center gap-6 text-[#00296b] font-semibold text-xl uppercase">
            {menuItems.map((item, index) => {
              const isActive =
                item.to === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.to);
              return (
                <li
                  key={item.name}
                  className={`cursor-pointer fade-in-menu-item transition-colors duration-300
                    ${isActive ? "text-[#fdc500]" : "hover:text-[#fdc500]"}`}
                  style={{ animationDelay: `${(index + 1) * 0.1}s` }}
                  onClick={() => handleNavigate(item.to)}
                >
                  {item.name}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* ANIMATIONER */}
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
      `}</style>
    </div>
  );
}
