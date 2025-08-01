import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, createContext } from "react";
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

// --- Create a Prediction Context ---
export const PredictionContext = createContext();

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

  // New state to hold all predictions for the session
  const [allPredictions, setAllPredictions] = useState([]);

  // Function to add a new prediction to our in-memory array
  const handleNewPrediction = (newPrediction) => {
    setAllPredictions(prevPredictions => [newPrediction, ...prevPredictions]);
  };

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
      {/* We wrap the entire app in the PredictionContext Provider */}
      <PredictionContext.Provider value={{ allPredictions, handleNewPrediction }}>
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
                  {/* Predictor will now get the `handleNewPrediction` from context */}
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
              {/* AllPredictions will now get the predictions from context */}
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
