import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

// Import your page and layout components
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Predictor from "./pages/Predictor";
import History from "./components/History";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AllPredictions from "./pages/admin/AllPredictions";
import AdminFeedback from "./pages/admin/AdminFeedback";
import ManageUsers from "./pages/admin/ManageUsers";
import AdminLayout from "./pages/admin/AdminLayout";

// --- ProtectedAdminRoute Component ---
const ProtectedAdminRoute = ({ children }) => {
  const adminToken = localStorage.getItem("adminToken");
  if (!adminToken) {
    return <Navigate to="/admin-login" replace />;
  }
  return children;
};

// --- ProtectedUserRoute Component ---
const ProtectedUserRoute = ({ children }) => {
  const userToken = localStorage.getItem("userToken");
  console.log(
    "ProtectedUserRoute: Checking userToken:",
    userToken ? "Exists" : "Does NOT exist"
  );
  if (!userToken) {
    console.log(
      "ProtectedUserRoute: No userToken found, redirecting to /login"
    );
    return <Navigate to="/login" replace />;
  }
  console.log("ProtectedUserRoute: userToken found, rendering children.");
  return children;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("userToken")
  );
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(
    !!localStorage.getItem("adminToken")
  );

  console.log("App Component Render: isAdminLoggedIn state:", isAdminLoggedIn);

  useEffect(() => {
    console.log("App useEffect: Initializing/checking auth status...");

    const checkAuthStatus = () => {
      const userHasToken = !!localStorage.getItem("userToken");
      const adminHasToken = !!localStorage.getItem("adminToken");

      console.log(
        "App useEffect: localStorage check - userToken:",
        userHasToken,
        "adminToken:",
        adminHasToken
      );

      if (userHasToken !== isLoggedIn) {
        setIsLoggedIn(userHasToken);
        console.log("App useEffect: setIsLoggedIn to", userHasToken);
      }
      if (adminHasToken !== isAdminLoggedIn) {
        setIsAdminLoggedIn(adminHasToken);
        console.log("App useEffect: setIsAdminLoggedIn to", adminHasToken);
      }
    };

    window.addEventListener("storage", checkAuthStatus);
    checkAuthStatus();

    return () => {
      console.log("App useEffect: Cleaning up storage event listener.");
      window.removeEventListener("storage", checkAuthStatus);
    };
  }, [isLoggedIn, isAdminLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    toast.success("Logged out successfully!");
  };

  // For admin logout
  const handleAdminLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAdminLoggedIn(false);
    toast.success("Admin logged out successfully!");
  };

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/predict"
            element={
              <ProtectedUserRoute>
                <Predictor onLogout={handleLogout} />
              </ProtectedUserRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedUserRoute>
                <History />
              </ProtectedUserRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin-login"
            element={<AdminLogin setIsAdminLoggedIn={setIsAdminLoggedIn} />}
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminLayout onAdminLogout={handleAdminLogout} />
              </ProtectedAdminRoute>
            }
          >
            {/* Nested Admin Routes (will render inside AdminLayout's <Outlet />) */}
            <Route index element={<AdminDashboard />} />
            <Route path="predictions" element={<AllPredictions />} />
            <Route path="feedback" element={<AdminFeedback />} />
            <Route path="users" element={<ManageUsers />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
