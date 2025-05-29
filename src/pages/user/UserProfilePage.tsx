import { useEffect, useState } from "react";
import api from "../../api/axios";
import AOS from "aos";
import "aos/dist/aos.css";
import { User } from "../../types";

import ProfileImageUpload from "../../components/Profile/ProfileImageUpload";
import PasswordChangeForm from "../../components/Profile/PasswordChangeForm";

function UserProfilePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    AOS.init({ duration: 800 });
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await api.get("/users/profile");
      setUser(res.data);
    } catch (err) {
      console.error("Kunde inte hämta användarinfo", err);
    }
  };

  if (!user) return <p className="p-8">🔄 Laddar profilen...</p>;

  return (
    <div className="min-h-screen bg-white flex mt-[150px] flex-col justify-between">
      <div className="flex justify-center items-center px-4 lg:px-12 xl:px-20 pt-10 pb-12">
        <div className="w-full max-w-3xl p-8 bg-white  rounded-2xl text-center lg:text-left grid lg:grid-cols-2 gap-12" data-aos="fade-up">

          <ProfileImageUpload user={user} onUpdate={fetchUserProfile} />

          <PasswordChangeForm />
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;