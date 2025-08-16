import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  collection,
  query,
  onSnapshot,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  ArrowUturnLeftIcon,
  TrashIcon,
  ClockIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

// Import PredictionContext 
import { PredictionContext } from "../context/PredictionContext";


import HistoryShimmer from "../components/shimmer/HistoryShimmer";

const History = () => {
  const { db, userId } = useContext(PredictionContext);

  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (db && userId) {
        setLoading(true);
        const q = query(collection(db, "users", userId, "predictions"));

        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const userPredictions = snapshot.docs.map((document) => ({
              id: document.id,
              ...document.data(),
            }));

            const sortedUserPredictions = userPredictions.sort((a, b) => {
              const timestampA = a.timestamp?.seconds || 0;
              const timestampB = b.timestamp?.seconds || 0;
              return timestampB - timestampA;
            });

            setPredictions(sortedUserPredictions);
            setLoading(false);
          },
          (error) => {
            console.error("Error fetching user's predictions:", error);
            setLoading(false);
            toast.error("Failed to load history.");
          }
        );

        return () => unsubscribe();
      } else {
        setLoading(false);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [db, userId]);

  const clearHistory = async () => {
    if (!db || !userId) {
      toast.error("Database is not ready. Please try again.");
      return;
    }

    setShowConfirmModal(false);

    try {
      const userPredictionsRef = collection(db, "users", userId, "predictions");
      const querySnapshot = await getDocs(userPredictionsRef);

      const deletePromises = querySnapshot.docs.map((document) =>
        deleteDoc(doc(db, "users", userId, "predictions", document.id))
      );

      await Promise.all(deletePromises);

      toast.success("Prediction history cleared!");
    } catch (error) {
      console.error("Error clearing history:", error);
      toast.error("Failed to clear history. Please try again.");
    }
  };

  if (loading) {
    return <HistoryShimmer />;
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
              {predictions.length === 0 ? (
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
                predictions.map((h, i) => (
                  <tr
                    key={h.id || i}
                    className="hover:bg-purple-500/5 transition-colors duration-150 ease-in-out"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {h.timestamp?.seconds
                        ? new Date(h.timestamp.seconds * 1000).toLocaleString()
                        : "N/A"}
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
                      {h.confidence &&
                        !isNaN(h.confidence) &&
                        `${(parseFloat(h.confidence) * 100).toFixed(2)}%`}
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
            onClick={() => setShowConfirmModal(true)}
            className="flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={predictions.length === 0}
          >
            <TrashIcon className="h-5 w-5" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative p-8 bg-white w-96 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-700">
              Are you sure you want to clear all prediction history? This action
              cannot be undone.
            </p>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={clearHistory}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Clear History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
