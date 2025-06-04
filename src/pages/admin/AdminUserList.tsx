import { useEffect, useState } from "react";
import api from "../../api/axios";
import SearchInput from "../../components/General/SearchInput";
import Pagination from "../../components/General/Pagination";

// Admin-vy för att visa, söka och radera användare
function AdminUserList() {
  const [users, setUsers] = useState<any[]>([]);             
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");    
  const [currentPage, setCurrentPage] = useState(1);     
  const [loading, setLoading] = useState(true);        
  const [error, setError] = useState<string | null>(null);  
  const USERS_PER_PAGE = 10;                                 

  // Hämtar användare vid sidladdning
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtrerar användare vid sökterm eller uppdatering
  useEffect(() => {
    applyFilter();
  }, [searchTerm, users]);

  // API-anrop för att hämta alla användare
  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
      setFilteredUsers(res.data);
      setLoading(false);
    } catch (err) {
      setError("Kunde inte hämta användare");
      setLoading(false);
    }
  };

  // Filtrerar användare baserat på namn eller e-post
  const applyFilter = () => {
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    // Gå till första sidan efter ny sökning
    setCurrentPage(1); 
  };

  // Tar bort en användare efter bekräftelse
  const deleteUser = async (id: number) => {
    const confirmed = window.confirm("Är du säker på att du vill ta bort användaren?");
    if (!confirmed) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
    } catch {
      alert("Kunde inte ta bort användaren.");
    }
  };

  // Beräkningar för sidindelning
  const indexOfLast = currentPage * USERS_PER_PAGE;
  const indexOfFirst = indexOfLast - USERS_PER_PAGE;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  // Tillstånd för laddning eller fel
  if (loading) return <p className="text-center mt-8">🔄 Laddar användare...</p>;
  if (error) return <p className="text-center text-red-500 mt-8">{error}</p>;

  return (
    <div className="max-w-screen-xl mt-[150px] mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">👥 Alla användare</h2>

      {/* Sökfält */}
      <SearchInput
        query={searchTerm}
        onChange={setSearchTerm}
        onSearch={applyFilter}
        onClear={() => setSearchTerm("")}
      />

      {/* Användartabell */}
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="text-left px-4 py-3">Namn</th>
              <th className="text-left px-4 py-3">E-post</th>
              <th className="text-left px-4 py-3">Nivå</th>
              <th className="text-left px-4 py-3">Åtgärder</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, i) => (
              <tr
                key={user.id}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.level}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="text-red-600 hover:underline cursor-pointer"
                  >
                    🗑 Radera
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginering */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
        />
      )}
    </div>
  );
}

export default AdminUserList;
