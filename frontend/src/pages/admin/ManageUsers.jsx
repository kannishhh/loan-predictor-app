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
      const token = localStorage.getItem("adminToken");
      const res = await fetch("http://localhost:5000/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users: ", error);
      toast.error("Failed to load users.");
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
      const token = localStorage.getItem("adminToken");
      const res = await fetch(
        `http://localhost:5000/api/admin/users/delete/${email}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "User deleted successfully!");
        fetchUsers();
      } else {
        throw new Error(data.message || "Failed to delete user.");
      }
    } catch (error) {
      console.error("Error deleting user: ", error);
      toast.error(error.message || "Error deleting user.");
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
      const token = localStorage.getItem("adminToken");
      const res = await fetch(
        `http://localhost:5000/api/admin/users/reset/${email}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-6 flex flex-col items-center">
      <div className="w-full max-w-6xl bg-white p-8 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-10 border-b border-gray-200 pb-6">
          <h1 className="text-4xl font-extrabold text-gray-700 tracking-tight flex items-center">
            <UserGroupIcon className="h-10 w-10 text-purple-500 mr-3" />
            Manage Users
          </h1>
        </div>
        <p className="text-gray-600 text-lg mb-8">
          View, search, and manage user accounts on your platform.
        </p>

        <div className="relative mb-8">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="w-full mt-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-10 bg-white rounded-xl shadow-lg text-gray-800">
              <ArrowPathIcon className="h-12 w-12 text-purple-500 animate-spin mb-4" />
              <p className="text-lg font-medium">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-10 bg-white rounded-xl shadow-lg">
              <ExclamationCircleIcon className="h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg font-medium">
                {search ? "No users match your search." : "No users found."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((u) => (
                    <tr
                      key={u.email}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6 whitespace-nowrap">
                        {u.email}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        {new Date(u.created_at).toLocaleString()}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-center space-x-2">
                        <button
                          onClick={() => handleReset(u.email)}
                          className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                        >
                          <ArrowPathIcon className="h-4 w-4 inline-block mr-1" />
                          Reset
                        </button>
                        <button
                          onClick={() => handleDelete(u.email)}
                          className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                        >
                          <TrashIcon className="h-4 w-4 inline-block mr-1" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
