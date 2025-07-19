import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowRightEndOnRectangleIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

const AdminLogin = ({ setIsAdminLoggedIn }) => {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleAdminLogin = (e) => {
    e.preventDefault();

    if (adminId === "admin" && password === "admin123") {
      localStorage.setItem("isAdminLoggedIn", "true");
      setIsAdminLoggedIn(true);
      toast.success("Admin Logged In");
      navigate("/admin");
    } else {
      toast.error("Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-[0_4px_6px_rgba(0,0,0,0.05),0_10px_15px_rgba(0,0,0,0.03)] p-8 md:p-10 transform transition-all duration-300 ease-in-out hover:shadow-[0 6px 8px rgba(0, 0, 0, 0.07), 0 12px 20px rgba(0, 0, 0, 0.05)]">
        <div className="text-center mb-8">
          <ShieldCheckIcon className="h-16 w-16 text-purple-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Admin Login</h2>
          <p className="text-gray-600 text-sm mt-2">
            Access the administrative control panel.
          </p>
        </div>
        <form onSubmit={handleAdminLogin} className="space-y-6">
          <div>
            <label
              htmlFor="admin-id "
              className="block text-sm font-medium text-gray-800 mb-2"
            >
              Admin ID
            </label>

            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600" />
              <input
                type="text"
                id="admin-id"
                placeholder="Admin ID"
                value={adminId}
                autoComplete="username"
                onChange={(e) => setAdminId(e.target.value)}
                className="w-full pl-10 pr-y py-2 border border-gray-500  rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 transition-all duration-200 ease-in-out"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-sm font-medium text-gray-800 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600" />
              <input
                type="password"
                placeholder="********"
                id="admin-password"
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-y py-2 border border-gray-500  rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800 transition-all duration-200 ease-in-out"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-500 text-white font-semibold rounded-lg shadow-md hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 ease-in-out"
          >
            <ArrowRightEndOnRectangleIcon className="h-5 w-5" />
            <span>Login</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
