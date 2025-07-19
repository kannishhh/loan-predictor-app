import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowUturnLeftIcon,
  ClockIcon,
  InformationCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const History = () => {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    const fetchHistory = async () => {
      if (!email) {
        setHistory([]);
        return;
      }
      try {
        const res = await fetch(
          `http://localhost:5000/history?email=${encodeURIComponent(email)}`
        );
        if (res.ok) {
          const data = await res.json();
          const sortedHistory = data.sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
          );
          setHistory(sortedHistory);
        } else {
          console.error(
            "Failed to fetch history: ",
            res.status,
            res.statusText
          );
          setHistory([]);
        }
      } catch (error) {
        console.error("Error fetching history: ", error);
        setHistory([]);
      }
    };
    fetchHistory();
  }, [email]);

  const clearHistory = async () => {
    if (!email) {
      console.warn("No user email found to clear history.");
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
        `http://localhost:5000/history?email=${encodeURIComponent(email)}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setHistory([]);
        toast.success("Prediction history cleared!");
      } else {
        console.error("Failed to clear history: ", res.status, res.statusText);
        toast.error("Failed to clear history, Please try agian.");
      }
    } catch (error) {
      console.error("Error clearing history:", error);
      toast.error("Server error when clearing history. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans p-6 flex flex-col items-center">
      <div className="w-full max-w-5xl bg-white p-8 rounded-xl shadow transform transition-all duration-300 ease-in-out hover:shadow-lg">
        <div className="flex justify-center items-center mb-10 border-b border-gray-500 pb-6">
          <h1 className="text-4xl font-extrabold items-center text-gray-800 tracking-tight flex">
            <ClockIcon className="h-10w-10 text-purple-500" />
            Prediction History
          </h1>
        </div>

        <div className="mt-8 overflow-x-auto overflow-y-auto max-h-[60vh] rounded-lg border border-gray-500">
          <table className="min-w-full divide-y divide-gray-500">
            <thead className="bg-gray-300 sticky top-0 z-10">
              <tr className="bg-gray-900/40 text-lg">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
                  Result
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
                  Confidence
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">
                  Input details
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-500">
              {history.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-10 text-center text-lg text-gray-600"
                  >
                    <InformationCircleIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    No prediction history found for this user.
                    <p className="mt-2 text-sm">
                      Make some predictions on the{" "}
                      <Link
                        to="/predict"
                        className="text-primary-accent hover:underline font-semibold"
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
                    key={i}
                    className="hover:bg-purple-500/5 transition-colors duration-150 ease-in-out "
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {h.timestamp}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        h.result.includes("Repaid")
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {h.result}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {h.confidence}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <button
                        onClick={() => alert(JSON.stringify(h.input, null, 2))}
                        className="text-blue-500 hover:underline "
                      >
                        View Inputs
                      </button>
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
            className="flex items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-800 focus:ring-offset-2"
          >
            <ArrowUturnLeftIcon className="h-5 w-5" />
            <span>Go Back</span>
          </button>
          <button
            onClick={clearHistory}
            className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
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
