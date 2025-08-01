import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRightEndOnRectangleIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { GoogleLogin } from "@react-oauth/google";

const Login = ({ setIsLoggedIn }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("userToken", data.access_token);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", form.email);
        setIsLoggedIn(true);
        toast.success("Login successful!");
        navigate("/predict");
      } else {
        toast.error(data.error || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login server error:", error);
      toast.error("Server error. Try again.");
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await fetch("http://localhost:5000/google-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("userToken", data.access_token);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", data.email);
        setIsLoggedIn(true);
        toast.success("Login successful!");
        navigate("/predict");
      } else {
        toast.error(data.error || "Google login failed");
      }
    } catch (error) {
      console.error("Google login server error:", error);
      toast.error("Server error. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      <div
        className="hidden lg:flex w-1/2 bg-gradient-to-br from-purple-500 to-teal-400
                      items-center justify-center p-8 relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")",
          }}
        ></div>

        <div className="text-center text-white relative z-10 p-6 rounded-lg bg-black bg-opacity-20">
          <UserCircleIcon className="h-24 w-24 mx-auto mb-6 opacity-90" />
          <h2 className="text-4xl font-extrabold mb-4 leading-tight">
            Welcome Back!
          </h2>
          <p className="text-lg opacity-90 max-w-md mx-auto">
            Log in to continue predicting and managing your data.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 md:p-10 transform transition-all duration-300 ease-in-out hover:shadow-xl">
          <h2 className="text-3xl font-bold text-gray-700 text-center mb-8">
            Login to Your Account
          </h2>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="your@example.com"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg
                             focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                             text-gray-700 transition-all duration-200 ease-in-out"
                  autoComplete="username"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg
                             focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                             text-gray-700 transition-all duration-200 ease-in-out"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
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

          <p className="mt-8 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-purple-500 hover:underline"
            >
              Signup
            </Link>
          </p>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => {
                  toast.error("Google Login Failed");
                }}
              />
            </div>
          </div>
          <p className="text-center text-sm text-gray-500 mt-2">
            Are you an admin?{" "}
            <Link
              to="/admin-login"
              className="font-medium text-purple-500 hover:underline"
            >
              Login as Admin
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
