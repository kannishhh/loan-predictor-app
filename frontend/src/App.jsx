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
import GithubCallback from "./pages/GithubCallback";
import { PredictionContext } from "./context/PredictionContext";

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
  if (!userToken) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("userToken")
  );
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(
    !!localStorage.getItem("adminToken")
  );

  const [allPredictions, setAllPredictions] = useState([]);

  const handleNewPrediction = (newPrediction) => {
    setAllPredictions((prevPredictions) => [newPrediction, ...prevPredictions]);
  };

  useEffect(() => {
    const fetchAllPredictions = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) return;

        const res = await fetch("http://localhost:5000/api/admin/predictions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setAllPredictions(data);
        } else {
          console.error("Failed to fetch all predictions");
        }
      } catch (error) {
        console.error("Error fetching predictions:", error);
      }
    };

    if (isAdminLoggedIn) {
      fetchAllPredictions();
    }
  }, [isAdminLoggedIn]);

  useEffect(() => {
    const checkAuthStatus = () => {
      const userHasToken = !!localStorage.getItem("userToken");
      const adminHasToken = !!localStorage.getItem("adminToken");

      if (userHasToken !== isLoggedIn) {
        setIsLoggedIn(userHasToken);
      }
      if (adminHasToken !== isAdminLoggedIn) {
        setIsAdminLoggedIn(adminHasToken);
      }
    };

    window.addEventListener("storage", checkAuthStatus);
    checkAuthStatus();

    return () => {
      window.removeEventListener("storage", checkAuthStatus);
    };
  }, [isLoggedIn, isAdminLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    toast.success("Logged out successfully!");
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAdminLoggedIn(false);
    toast.success("Admin logged out successfully!");
  };

  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />

      <PredictionContext.Provider
        value={{ allPredictions, handleNewPrediction }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route
              path="/login"
              element={<Login setIsLoggedIn={setIsLoggedIn} />}
            />
            <Route
              path="/signup"
              element={<Signup setIsLoggedIn={setIsLoggedIn} />}
            />
            <Route
              path="/github/callback"
              element={<GithubCallback setIsLoggedIn={setIsLoggedIn} />}
            />

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
      </PredictionContext.Provider>
    </div>
  );
}

export default App;
