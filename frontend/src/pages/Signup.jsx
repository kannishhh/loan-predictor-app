import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  UserPlusIcon,
  EnvelopeIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";

const Signup = () => {
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
      await createUserWithEmailAndPassword(auth, form.email, form.password);
      toast.success("Signup successful! Please login.");
      navigate("/login");
    } catch (error) {
      console.error("Firebase signup error:", error);
      toast.error(error.message || "Signup failed");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      toast.success("Google signup successful!");
      navigate("/predict");
    } catch (error) {
      console.error("Google signup error:", error);
      toast.error(error.message || "Google signup failed");
    }
  };

  const handleGitLogin = async () => {
    try {
      await signInWithPopup(auth, new GithubAuthProvider());
      toast.success("GitHub signup successful!");
      navigate("/predict");
    } catch (error) {
      console.error("GitHub signup error:", error);
      toast.error(error.message || "GitHub signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 lg:p-12">
        <div className="text-center mb-8">
          <UserPlusIcon className="h-16 w-16 text-purple-500 mx-auto mb-4" />
          <h1 className="text-gray-800 text-3xl font-bold text-center mb-2">
            Create Your Account
          </h1>
          <p className="text-gray-600 text-lg mt-1">
            Join us and start your journey!
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          <div className="relative">
            <div className="relative">
              <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="your@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 text-gray-700 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                autoComplete="username"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="relative">
            <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 text-gray-700 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-purple-500 hover:underline"
          >
            Login
          </Link>
        </p>

        <div className="mt-6">
          <div className="relative flex justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-3 text-sm text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
          <div className="mt-4 space-y-4">
            <button
              onClick={handleGoogleLogin}
              className="w-full py-3 flex items-center justify-center rounded-lg border text-gray-700 hover:bg-gray-50 transition"
            >
              <span className="mr-2">
                <svg
                  className="w-5 h-5 mr-2"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              </span>
              Sign up with Google
            </button>

            <button
              onClick={handleGitLogin}
              className="w-full py-3 flex items-center justify-center rounded-lg border text-gray-700 hover:bg-gray-50 transition"
            >
              <span className="mr-2">
                <svg
                  className="w-5 h-5 mr-2"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 0C4.477 0 0 4.477 0 10c0 4.418 2.865 8.166 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 5.454c.828 0 1.658.126 2.422.372 1.91-1.296 2.75-1.026 2.75-1.026.546 1.378.203 2.397.1 2.65.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.943.359.308.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0020 10c0-5.523-4.477-10-10-10z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              Sign up with GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
