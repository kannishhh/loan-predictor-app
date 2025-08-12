import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

// Import Firebase services
import { db, auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

// Import page and layout components
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Predictor from "./pages/Predictor";
import History from "./components/History";
import GithubCallback from "./pages/GithubCallback";
import { PredictionContext } from "./context/PredictionContext";

// --- Protected Route Component ---
const ProtectedRoute = ({ children, userId }) => {
  if (!userId) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {

  const [allPredictions, setAllPredictions] = useState([]);
  const [userId, setUserId] = useState(null);

  const handleNewPrediction = (newPrediction) => {
    setAllPredictions((prevPredictions) => [newPrediction, ...prevPredictions]);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut();
    toast.success("Logged out successfully!");
  };

  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />

      <PredictionContext.Provider
        value={{ allPredictions, db, userId, handleNewPrediction }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/github/callback" element={<GithubCallback />} />

            <Route
              path="/predict"
              element={
                <ProtectedRoute userId={userId}>
                  <Predictor onLogout={handleLogout} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute userId={userId}>
                  <History />
                </ProtectedRoute>
              }
            />

            {/* Admin routes have been removed */}

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </PredictionContext.Provider>
    </div>
  );
}

export default App;
