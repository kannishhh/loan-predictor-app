import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserGroupIcon,
  ArrowRightEndOnRectangleIcon,
  BoltIcon,
  UserPlusIcon, 
  ChartPieIcon, 
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const AdminDashboard = ({ onAdminLogout }) => {
  const navigate = useNavigate();
  const [recentSignups, setRecentSignups] = useState([]);
  const [recentLogins, setRecentLogins] = useState([]);
  const [recentPredictions, setRecentPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const adminToken = localStorage.getItem("adminToken", );

  const fetchData = useCallback(async (endpoint, setDataState) => {
    if (!adminToken) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000${endpoint}?limit=5`, {
        headers: {
          "Authorization": `Bearer ${adminToken}`, 
        },
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          toast.error("Session expired or unauthorized. Please login again.");
          onAdminLogout(); 
          navigate("/admin-login");
          return; 
        }
        throw new Error(`Failed to fetch ${endpoint}: ${res.statusText}`);
      }
      const data = await res.json();
      setDataState(data);
    } catch (err) {
      console.error(`Error fetching ${endpoint}:`, err);
      setError("Failed to load dashboard data.");
      toast.error(`Failed to load data for ${endpoint.split('/').pop().replace('-', ' ')}.`);
    }
  }, [adminToken, navigate, onAdminLogout]); 

  
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);
      if (adminToken) {
        await Promise.all([
          fetchData("/admin/dashboard/recent-signups", setRecentSignups),
          fetchData("/admin/dashboard/recent-logins", setRecentLogins),
          fetchData("/admin/dashboard/recent-predictions", setRecentPredictions),
        ]);
      } else {
        
        setLoading(false);
      }
      setLoading(false);
    };
    loadDashboardData();
  }, [adminToken, fetchData]); 

  const handleLogout = () => {
    onAdminLogout(); 
    toast.success("Admin logged out successfully.");
    navigate("/admin-login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center text-gray-700">
          <BoltIcon className="h-16 w-16 animate-pulse text-purple-500" />
          <p className="mt-4 text-xl font-semibold">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-500"> 
          <ExclamationCircleIcon className="h-20 w-20 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Error Loading Dashboard</h2>
          <p className="mt-2">{error}</p>
          <button
            onClick={handleLogout} 
            className="mt-6 inline-flex items-center space-x-2 bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition duration-300 ease-in-out"
          >
            Go to Admin Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-6 flex flex-col items-center">
      <div className="w-full max-w-6xl bg-white p-8 rounded-xl shadow-lg transform transition-all duration-300 ease-in-out hover:shadow-xl">
        
        <div className="flex justify-between items-center mb-10 border-b border-gray-200 pb-6">
          <h1 className="text-4xl font-extrabold text-gray-700 tracking-tight flex items-center">
            <UserGroupIcon className="h-10 w-10 text-purple-500 mr-3" />
            Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <ArrowRightEndOnRectangleIcon className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>

       
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
          <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-700 mb-4 flex items-center">
              <UserPlusIcon className="h-6 w-6 text-green-500 mr-2" /> Recent Signups
            </h2>
            {recentSignups.length === 0 ? (
              <p className="text-gray-500">No recent signups.</p>
            ) : (
              <ul className="space-y-3">
                {recentSignups.map((signup, index) => (
                  <li key={index} className="flex justify-between items-center text-gray-700">
                    <span className="font-medium">{signup.email}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(signup.created_at).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

         
          <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-700 mb-4 flex items-center">
              <BoltIcon className="h-6 w-6 text-purple-500 mr-2" /> Recent Logins
            </h2>
            {recentLogins.length === 0 ? (
              <p className="text-gray-500">No recent logins.</p>
            ) : (
              <ul className="space-y-3">
                {recentLogins.map((login, index) => (
                  <li key={index} className="flex justify-between items-center text-gray-700">
                    <span className="font-medium">{login.email}</span> 
                    <span className="text-sm text-gray-500">
                      {new Date(login.timestamp).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

         
          <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-700 mb-4 flex items-center">
              <ChartPieIcon className="h-6 w-6 text-teal-400 mr-2" /> Recent Predictions
            </h2>
            {recentPredictions.length === 0 ? (
              <p className="text-gray-500">No recent predictions.</p>
            ) : (
              <ul className="space-y-3">
                {recentPredictions.map((prediction, index) => (
                  <li key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-gray-700">
                    <div>
                        <span className="font-medium">{prediction.email}</span>
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                            prediction.result?.includes("Repaid") ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                        }`}>
                            {prediction.result?.includes("Repaid") ? "Repaid" : "Non-Repaid"} 
                        </span>
                    </div>
                    <span className="text-sm text-gray-500 mt-1 sm:mt-0">
                      {new Date(prediction.timestamp).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
