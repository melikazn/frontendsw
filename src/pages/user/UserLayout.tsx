import { Outlet } from "react-router-dom";
import HeaderUser from "../../components/HeaderUser";

export default function UserLayout() {
  return (
    <div className="bg-white text-[#00296b] min-h-screen">
      <HeaderUser />
      <main className="px-4 py-6 max-w-6xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
