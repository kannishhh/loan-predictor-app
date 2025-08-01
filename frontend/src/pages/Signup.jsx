import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  UserPlusIcon,
  EnvelopeIcon,
  LockClosedIcon,
  ArrowRightEndOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { GoogleLogin } from "@react-oauth/google";

const Signup = ({ setIsLoggedIn }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Signup successful! Please login.");
        navigate("/login");
      } else {
        toast.error(data.error || "Signup failed");
      }
    } catch (error) {
      console.error("Signup server error:", error);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-[0_4px_6px_rgba(0,0,0,0.05),0_10px_15px_rgba(0,0,0,0.03)] p-8 md:p-10 transform transition-all duration-300 ease-in-out hover:shadow-[0 6px 8px rgba(0, 0, 0, 0.07), 0 12px 20px rgba(0, 0, 0, 0.05)]">
        <div className="text-center mb-8">
          <UserPlusIcon className="h-16 w-16 text-purple-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800">
            Create Your Account
          </h2>
          <p className="text-gray-600 text-sm mt-2">
            Join us and start your journey!
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-800 mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600" />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="your@example.com"
                className="w-full pl-10 pr-4 py-2 border border-gray-500 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                           text-gray-800 transition-all duration-200 ease-in-out"
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
              className="block text-sm font-medium text-gray-800 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600" />
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 border border-gray-500 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                           text-gray-800 transition-all duration-200 ease-in-out"
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 px-4 py-2
                       bg-purple-500 text-white font-semibold rounded-lg shadow-[0_4px_6px_rgba(0,0,0,0.05),0_10px_15px_rgba(0,0,0,0.03)]
                       hover:bg-purple-800 focus:outline-none focus:ring-2
                       focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 ease-in-out"
          >
            <ArrowRightEndOnRectangleIcon className="h-5 w-5 -rotate-90 transform" />
            <span>Sign Up</span>
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-purple-500 hover:underline"
          >
            Login
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
      </div>
    </div>
  );
};

export default Signup;
