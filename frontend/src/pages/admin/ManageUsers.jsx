import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  ArrowPathIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/users");
      if (!res.ok) {
        throw new Error("HTTP error! status: ${res.status}");
      }
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users: ", error);
      toast.error("Failed to load users. ");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (email) => {
    if (
      !window.confirm(
        `Are you sure you want to delete user ${email}? This action cannot be undone.`
      )
    ) {
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/users/delete/${email}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "User deleted suucessfully!");
        fetchUsers();
      } else {
        throw new Error(data.message || "Failed to delete user.");
      }
    } catch (error) {
      console.error("Error deleting user: ", error);
      toast.success(error.message);
    }
  };

  const handleReset = async (email) => {
    if (
      !window.confirm(
        `Are you sure you want to reset predictions for ${email}?`
      )
    ) {
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/users/reset-predictions/${email}`,
        { method: "PUT" }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "User predictions reset successfully!");
      } else {
        throw new Error(data.message || "Failed to reset predictions.");
      }
    } catch (error) {
      console.error("Error resetting predictions: ", error);
      toast.error(error.message || "Error resetting predictions.");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 tracking-tight flex items-center">
          <UserGroupIcon className="h-10 w-10 text-purple-500 mr-3" /> 
          Manage Users
        </h1>
        <p className="text-gray-600 text-lg">
          View, search, and manage user accounts on your platform.
        </p>
      </div>

      <div className="flex items-center gap-4 mb-8 p-6 bg-white rounded-xl shadow-[0_4px_6px_rgba(0,0,0,0.05),0_10px_15px_rgba(0,0,0,0.03)]">
        <div className="relative w-ful">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600" />
          <input
            type="text"
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-500 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ease-in-out text-gray-800"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-10 bg-white rounded-xl shadow-[0_4px_6px_rgba(0,0,0,0.05),0_10px_15px_rgba(0,0,0,0.03)] text-gray-800">
          <ArrowPathIcon className="h-12 w-12 text-purple-500 animate-500 mb-4" />
          <p className="text-lg font-medium">Loading users...</p>
        </div>
      ) : filteredUsers.length === 0 && search === "" ? (
        <div className="flex flex-col items-center justify-center p-10 bg-white rounded-xl shadow-[0_4px_6px_rgba(0,0,0,0.05),0_10px_15px_rgba(0,0,0,0.03)] ">
          <ExclamationCircleIcon className="h-16 w-16 text-gray-600 mb-4" />
          <p className="text-gray-600 text-lg font-medium">
            No users found in the system
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Start by adding new users or check your backend connection.
          </p>
        </div>
      ) : filteredUsers.length === 0 && search !== "" ? (
        <div className="flex flex-col items-center justify-center p-10 bg-white rounded-xl shadow-[0_4px_6px_rgba(0,0,0,0.05),0_10px_15px_rgba(0,0,0,0.03)] ">
          <ExclamationCircleIcon className="h-16 w-16 text-gray-600 mb-4" />
          <p className="text-gray-600 text-lg font-medium">
            No users match your search criteria.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-[0_4px_6px_rgba(0,0,0,0.05),0_10px_15px_rgba(0,0,0,0.03)]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider rounded-tl-xl">
                  Name
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
                  Email
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider rounded-tr-xl">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-500">
              {filteredUsers.map((u) => (
                <tr
                  key={u.email}
                  className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                >
                  <td className="py-3 px-6 text-gray-800">{u.name || "N/A"}</td>
                  <td className="py-3 px-6 text-gray-800">{u.email}</td>
                  <td className="py-3 px-6 text-center space-x-3">
                    <button
                      onClick={() => handleReset(u.email)}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition-colors duration-200 ease-in-out flex-shrink-0 inline-flex items-center space-x-1"
                    >
                      <ArrowPathIcon className="h-4 w-4" />
                      <span>Reset Predictions</span>
                    </button>
                    <button
                      onClick={() => handleDelete(u.email)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 ease-in-out flex-shrink-0 inline-flex items-center space-x-1"
                    >
                      <TrashIcon className="h-4 w-4" />
                      <span>Delete User</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
