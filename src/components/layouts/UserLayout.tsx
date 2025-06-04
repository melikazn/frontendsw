import { Outlet } from "react-router-dom";
import HeaderUser from "./HeaderUser";
import Footer from "./FooterUser";

// Layout för inloggade användare – inkluderar Header, Footer och <Outlet> för sidor
export default function UserLayout() {
  return (
    <div className="bg-white text-[#00296b] min-h-screen flex flex-col">
      <HeaderUser />
      <main className="px-4 py-6 max-w-6xl mx-auto flex-grow">
        <Outlet />
      </main>
      <Footer/>
    </div>
  );
}
