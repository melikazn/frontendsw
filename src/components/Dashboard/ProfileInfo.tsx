import { User } from "../../types";

// Props: en användare
interface Props {
  user: User;
}

// Visar profilbild och användarens nivå
const ProfileInfo = ({ user }: Props) => (
  <div
    className="flex flex-col sm:flex-row items-center sm:justify-center gap-6 mb-10"
    data-aos="fade-up" // animation vid scroll
  >
    {user.profile_image ? (
      // Om profilbild finns, visa den
      <img
        src={`http://localhost:5050${user.profile_image}`}
        alt="Profilbild"
        className="w-24 h-24 rounded-full object-cover border shadow-md"
      />
    ) : (
      // Annars 
      <p className="italic">📷 Ingen profilbild uppladdad.</p>
    )}

    {/* visar användarens nivå */}
    <p className="text-lg font-medium">
      🎯 Din nuvarande nivå: <span className="font-semibold">{user.level}</span>
    </p>
  </div>
);

export default ProfileInfo;
