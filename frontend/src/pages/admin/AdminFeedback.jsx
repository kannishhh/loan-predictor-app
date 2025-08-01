import { useEffect, useState } from "react";
import axios from "axios";
import {
  ChatBubbleBottomCenterTextIcon,
  InboxIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

const AdminFeedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const response = await axios.get(
          "http://localhost:5000/api/admin/feedback",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFeedback(response.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching feedback: ", err);
        setError("Failed to load feedback. Please try again later.");
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-6 flex flex-col items-center">
      <div className="w-full max-w-6xl bg-white p-8 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-10 border-b border-gray-200 pb-6">
          <h1 className="text-4xl font-extrabold text-gray-700 tracking-tight flex items-center">
            <ChatBubbleBottomCenterTextIcon className="h-10 w-10 text-purple-500 mr-3" />
            User Feedback
          </h1>
        </div>
        <p className="text-gray-600 text-lg mb-8">
          Review and manage feedback submitted by users.
        </p>

        <div className="w-full mt-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-10 bg-white rounded-xl shadow-lg text-gray-800">
              <ArrowPathIcon className="h-12 w-12 text-purple-500 animate-spin mb-4" />
              <p className="text-lg font-medium">Loading feedback...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center p-10 bg-white rounded-xl shadow-lg text-red-500">
              <p className="text-lg font-medium">{error}</p>
            </div>
          ) : feedback.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-10 bg-white rounded-xl shadow-lg">
              <InboxIcon className="h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg font-medium">
                No feedback submitted yet.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <ul className="space-y-4">
                {feedback.map((fb, index) => (
                  <li
                    key={index}
                    className="pb-4 border-b border-gray-200 last:border-none last:pb-0"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-gray-800 font-semibold text-lg">
                        {fb.name}
                      </p>
                      {fb.date && (
                        <span className="text-gray-500 text-sm">
                          {new Date(fb.date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm mb-2">{fb.email}</p>
                    <p className="text-gray-700 leading-relaxed">{fb.message}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminFeedback;
