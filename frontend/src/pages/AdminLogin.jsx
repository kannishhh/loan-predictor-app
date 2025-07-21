import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ShieldCheckIcon,
  UserIcon,
  LockClosedIcon,
  ArrowRightEndOnRectangleIcon,
} from "@heroicons/react/24/outline";

const AdminLogin = ({ setIsAdminLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.access_token) {
          localStorage.setItem("adminToken", data.access_token);

          if (setIsAdminLoggedIn) {
            setIsAdminLoggedIn(true);
          }

          toast.success(data.message || "Admin Logged In");
          
          navigate("/admin");
        } else {
          toast.error("Login successful, but no token received.");
          
        }
      } else {
        toast.error(data.error || "Invalid Credentials");
        console.error("Admin login failed:", data.error);
      }
    } catch (error) {
      console.error("Admin login server error:", error);
      toast.error("Server error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans p-4">
      <div
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 md:p-10
                    transform transition-all duration-300 ease-in-out hover:shadow-xl"
      >
        <div className="text-center mb-8">
          <ShieldCheckIcon className="h-16 w-16 text-purple-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-700">Admin Login</h2>
          <p className="text-gray-500 text-sm mt-2">
            Access the administrative control panel.
          </p>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-6">
          <div>
            <label
              htmlFor="admin-email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Admin Email
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="email"
                id="admin-email"
                placeholder="admin@example.com"
                value={email}
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                           text-gray-700 transition-all duration-200 ease-in-out"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="password"
                id="admin-password"
                placeholder="••••••••"
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                           text-gray-700 transition-all duration-200 ease-in-out"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 px-4 py-2
                       bg-purple-500 text-white font-semibold rounded-lg shadow-md
                       hover:bg-purple-600 focus:outline-none focus:ring-2
                       focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 ease-in-out"
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
