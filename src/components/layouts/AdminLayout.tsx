import { Outlet } from "react-router-dom";
import HeaderAdmin from "./HeaderAdmin";
import Footer from "./Footer";

// Layoutkomponent för admin-sidor – inkluderar header, footer och <Outlet> för innehåll
export default function AdminLayout() {
  return (
    <div className="bg-white text-[#00296b] min-h-screen">
      <HeaderAdmin />
      <main className="px-4 py-6 max-w-6xl mx-auto">
        <Outlet />
      </main>
      <Footer/>
    </div>
  );
}
