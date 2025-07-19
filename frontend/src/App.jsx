import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [theme, setTheme] = useState("500");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  }, []);

  useEffect(() => {
    setIsAdminLoggedIn(localStorage.getItem("isAdminLoggedIn") === "true");
  }, []);

  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false");
    setIsLoggedIn(false);
  };

  return (
    <div className={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />

          <Route
            path="/predict"
            element={
              isLoggedIn ? (
                <Predictor
                  onLogout={handleLogout}
                  theme={theme}
                  setTheme={setTheme}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/history" element={<History />} />

          <Route
            path="/admin-login"
            element={<AdminLogin setIsAdminLoggedIn={setIsAdminLoggedIn} />}
          />

          <Route
            path="/admin"
            element={
              isAdminLoggedIn ? <AdminLayout /> : <Navigate to="/admin-login" />
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="predictions" element={<AllPredictions />} />
            {/* <Route path="stats" element={<AdminModelStats />} /> */}
            <Route path="feedback" element={<AdminFeedback />} />
            <Route path="users" element={<ManageUsers />} />
          </Route>

          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
