import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

// Import Firebase services
import { db, auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";

// Import page and layout components
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Predictor from "./pages/Predictor";
import History from "./components/History";
import GithubCallback from "./pages/GithubCallback";
import { PredictionContext } from "./context/PredictionContext";
import UserDashboard from "./pages/UserDashboard";

// --- Protected Route Component ---
const ProtectedRoute = ({ children, userId }) => {
  if (!userId) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [userPredictions, setUserPredictions] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleNewPrediction = (newPrediction) => {
    setUserPredictions((prevPredictions) => [
      newPrediction,
      ...prevPredictions,
    ]);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userId) {
      const q = collection(db, "users", userId, "predictions");

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const predictions = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUserPredictions(predictions);
        },
        (error) => {
          console.error("Error fetching real-time predictions:", error);
          toast.error("Failed to get real-time updates for predictions.");
        }
      );
      return () => unsubscribe();
    } else {
      setUserPredictions([]);
    }
  }, [userId]);

  const handleLogout = () => {
    auth.signOut();
    toast.success("Logged out successfully!");
  };

  if (loading) {
    return null;
  }

  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />

      <PredictionContext.Provider
        value={{ userPredictions, db, userId, handleNewPrediction }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/github/callback" element={<GithubCallback />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute userId={userId}>
                  <UserDashboard onLogout={handleLogout} />
                </ProtectedRoute>
              }
            />

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

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </PredictionContext.Provider>
    </div>
  );
}

export default App;
