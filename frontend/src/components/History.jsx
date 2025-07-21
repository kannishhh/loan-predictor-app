import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowUturnLeftIcon,
  TrashIcon,
  ClockIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userEmail = localStorage.getItem("userEmail");
  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    const fetchHistory = async () => {
      if (!userEmail || !userToken) {
        toast.error("Please login to view history.");
        navigate("/login");
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5000/history?email=${encodeURIComponent(
            userEmail
          )}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setHistory(data);
        } else if (res.status === 401 || res.status === 403) {
          toast.error("Session expired or unauthorized. Please login again.");
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("userToken");
          localStorage.removeItem("userEmail");
          navigate("/login");
        } else {
          console.error("Failed to fetch history:", res.status, res.statusText);
          toast.error("Failed to load history.");
          setHistory([]);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
        toast.error("Server error when loading history. Try again.");
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [userEmail, userToken, navigate]);

  const clearHistory = async () => {
    if (!userEmail || !userToken) {
      toast.error("Please login to clear history.");
      navigate("/login");
      return;
    }
    if (
      !window.confirm(
        "Are you sure you want to clear all prediction history? This action cannot be undone."
      )
    ) {
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:5000/history?email=${encodeURIComponent(userEmail)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if (res.ok) {
        setHistory([]);
        toast.success("Prediction history cleared!");
      } else if (res.status === 401 || res.status === 403) {
        toast.error("Session expired or unauthorized. Please login again.");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userToken");
        localStorage.removeItem("userEmail");
        navigate("/login");
      } else {
        console.error("Failed to clear history:", res.status, res.statusText);
        toast.error("Failed to clear history. Please try again.");
      }
    } catch (error) {
      console.error("Error clearing history:", error);
      toast.error("Server error when clearing history. Try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center text-gray-700">
          <ClockIcon className="h-16 w-16 animate-pulse text-purple-500" />
          <p className="mt-4 text-xl font-semibold">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-6 flex flex-col items-center">
      <div className="w-full max-w-5xl bg-white p-8 rounded-xl shadow-lg transform transition-all duration-300 ease-in-out hover:shadow-xl">
        <div className="flex justify-center items-center mb-10 border-b border-gray-200 pb-6">
          <h1 className="text-4xl font-extrabold text-gray-700 tracking-tight flex items-center">
            <ClockIcon className="h-10 w-10 text-purple-500 mr-3" />
            Prediction History
          </h1>
        </div>

        <div className="mt-8 overflow-x-auto overflow-y-auto max-h-[60vh] rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Result
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Confidence
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {history.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-10 text-center text-lg text-gray-500"
                  >
                    <InformationCircleIcon className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    No prediction history found for this user.
                    <p className="mt-2 text-sm">
                      Make some predictions on the{" "}
                      <Link
                        to="/predict"
                        className="text-purple-500 hover:underline font-semibold"
                      >
                        Predictor Page
                      </Link>
                      !
                    </p>
                  </td>
                </tr>
              ) : (
                history.map((h, i) => (
                  <tr
                    key={h.id || i}
                    className="hover:bg-purple-500/5 transition-colors duration-150 ease-in-out"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {h.timestamp}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                        h.result?.includes("Repaid")
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {h.result}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {h.confidence}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row justify-center sm:justify-evenly gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2"
          >
            <ArrowUturnLeftIcon className="h-5 w-5" />
            <span>Go Back</span>
          </button>
          <button
            onClick={clearHistory}
            className="flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            disabled={history.length === 0}
          >
            <TrashIcon className="h-5 w-5" />
            <span>Clear All</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default History;
