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
        const response = await axios.get(
          "http://localhost:5000/api/admin/feedback"
        );
        setFeedback(response.data);
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
    <div className="min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 tracking-tight flex items-center">
          <ChatBubbleBottomCenterTextIcon className="h-10 w-10 text-purple-500 mr-3" />
          User Feedback
        </h1>
        <p className="text-gray-500 text-lg">
          Review and manage feedback submitted by users.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-10 bg-white rounded-xl shadow-[0_4px_6px_rgba(0,0,0,0.05),0_10px_15px_rgba(0,0,0,0.03)] text-gray-800">
          <ArrowPathIcon className="h-12 w-12 text-purple-500 animate-spin mb-4" />
          <p className="text-lg font-medium">Loading feedback...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-10 bg-white rounded-xl shadow-[0_4px_6px_rgba(0,0,0,0.05),0_10px_15px_rgba(0,0,0,0.03)] text-error">
          <p className="text-lg font-medium">{error}</p>
        </div>
      ) : feedback.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-10 bg-white rounded-xl shadow-[0_4px_6px_rgba(0,0,0,0.05),0_10px_15px_rgba(0,0,0,0.03)]">
          <InboxIcon className="h-16 w-16 text-gray-800 mb-4" />
          <p className="text-gray-500 text-lg font-medium">
            No feedback submitted yet.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Check back later for new messages.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-[0_4px_6px_rgba(0,0,0,0.05),0_10px_15px_rgba(0,0,0,0.03)] p-6">
          <ul className="space-y-4">
            {feedback.map((fb, index) => (
              <li
                key={index}
                className="pb-4 border-b border-gray-500 last:border-none last:pb-0"
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
                <p className="text-gray-800 leading-relaxed">{fb.message}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminFeedback;
