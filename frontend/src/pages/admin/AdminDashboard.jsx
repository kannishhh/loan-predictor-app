import { useNavigate } from "react-router-dom";
import {
  ChartPieIcon,
  ChatBubbleBottomCenterTextIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const cardContentClasses = "flex flex-col items-center text-center h-full";
  const iconClasses = "h-16 w-16 text-purple-500 mb-4 mx-auto";

  return (
    <div className="min-h-screen">
      <div className="mb-10">
        <h2 className="text-4xl font-bold text-gray-800 mb-2 trackin-tight flex items-center">
          Admin Dashboard
        </h2>
        <p className="text-gray-500 text-lg">
          Welcome back! Here's a quick overview of your platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div
          onClick={() => navigate("/admin/predictions")}
          className="bg-white p-6 rounded-xl shadow-[0_4px_6px_rgba(0,0,0,0.05),0_10px_15px_rgba(0,0,0,0.03)] hover:shadow-[0 6px 8px rgba(0, 0, 0, 0.07), 0 12px 20px rgba(0, 0, 0, 0.05)] transition-all duration-300 ease-in-out cursor-pointer transform hover:-translate-y-1"
        >
          <div className={cardContentClasses}>
            <ClipboardDocumentListIcon className={iconClasses} />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Prediction Logs
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              View all user predictions, including status and model used.
            </p>
          </div>
        </div>

        <div
          onClick={() => navigate("/admin/stats")}
          className="bg-white p-6 rounded-xl shadow-[0_4px_6px_rgba(0,0,0,0.05),0_10px_15px_rgba(0,0,0,0.03)] hover:shadow-[0 6px 8px rgba(0, 0, 0, 0.07), 0 12px 20px rgba(0, 0, 0, 0.05)] transition-all duration-300 ease-in-out cursor-pointer transform hover:-translate-y-1"
        >
          <div className={cardContentClasses}>
            <ChartPieIcon className={iconClasses} />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Model Stats
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Accuracy, performance, and usage breakdown.
            </p>
          </div>
        </div>
        <div
          onClick={() => navigate("/admin/feedback")}
          className="bg-white p-6 rounded-xl shadow-[0_4px_6px_rgba(0,0,0,0.05),0_10px_15px_rgba(0,0,0,0.03)] hover:shadow-[0 6px 8px rgba(0, 0, 0, 0.07), 0 12px 20px rgba(0, 0, 0, 0.05)] transition-all duration-300 ease-in-out cursor-pointer transform hover:-translate-y-1"
        >
          <div className={cardContentClasses}>
            <ChatBubbleBottomCenterTextIcon className={iconClasses} />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Feedback Received
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Check user-submitted feedback and suggestions.
            </p>
          </div>
        </div>
        <div
          onClick={() => navigate("/admin/users")}
          className="bg-white p-6 rounded-xl shadow-[0_4px_6px_rgba(0,0,0,0.05),0_10px_15px_rgba(0,0,0,0.03)] hover:shadow-[0 6px 8px rgba(0, 0, 0, 0.07), 0 12px 20px rgba(0, 0, 0, 0.05)] transition-all duration-300 ease-in-out cursor-pointer transform hover:-translate-y-1"
        >
          <div className={cardContentClasses}>
            <UserGroupIcon className={iconClasses} />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Manage Users
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Add, delete or rest prediction history for users.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 p-8 bg-white rounded-xl shadow-[0_4px_6px_rgba(0,0,0,0.05),0_10px_15px_rgba(0,0,0,0.03)]">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Recent Platform Activity
        </h3>
        <p className="text-gray-500">
          Monitor the latest user interactions and system updates.
        </p>

        <ul className="mt-6 space-y-4">
          <li className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-500">
            <div className="flex items-center space-x-3">
              <ClipboardDocumentListIcon className="h-6 w-6 text-purple-500" />
              <span>New prediction submitted by **User ID 123**</span>
            </div>
            <span className="text-gray-500 text-sm"> 2 minutes ago</span>
          </li>

          <li className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-500">
            <div className="flex items-center space-x-3">
              <ChartPieIcon className="h-6 w-6 text-purple-500" />
              <span>Model 'Alpha 2.1' performance report generated</span>
            </div>
            <span className="text-gray-500 text-sm"> 1 hour ago</span>
          </li>

          <li className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-500">
            <div className="flex items-center space-x-3">
              <ChatBubbleBottomCenterTextIcon className="h-6 w-6 text-purple-500" />
              <span>New feedback received from **Guest User**</span>
            </div>
            <span className="text-gray-500 text-sm"> Yesterday</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
