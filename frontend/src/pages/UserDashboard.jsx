import { useContext } from "react";
import { Link } from "react-router-dom";
import { PredictionContext } from "../context/PredictionContext";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import {
  UserCircleIcon,
  ChartPieIcon,
  DocumentTextIcon,
  RocketLaunchIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import UserDashboardShimmer from "../components/shimmer/UserDashboardShimmer";

const UserDashboard = () => {
  const { userPredictions } = useContext(PredictionContext);

  const sortedPredictions = [...userPredictions].sort(
    (a, b) => b.timestamp?.seconds - a.timestamp?.seconds
  );

  const totalPredictions = sortedPredictions.length;
  const repaidCount = sortedPredictions.filter((p) =>
    p.result?.includes("Repaid")
  ).length;
  const defaultCount = totalPredictions - repaidCount;
  const latestPrediction = sortedPredictions[0];

  const pieChartData = [
    { name: "Repaid", value: repaidCount },
    { name: "Default", value: defaultCount },
  ];
  const PIE_COLORS = ["#10B981", "#EF4444"];

  if (!userPredictions || userPredictions.length === 0) {
    return <UserDashboardShimmer />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-6">
      <div className="w-full max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <div className="flex items-center mb-8 border-b border-gray-200 pb-4">
          <UserCircleIcon className="h-10 w-10 text-purple-500 mr-3" />
          <h1 className="text-4xl font-extrabold text-gray-800">
            Your Dashboard
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-purple-50 p-6 rounded-xl shadow-md text-center">
            <DocumentTextIcon className="h-10 w-10 text-purple-500 mx-auto mb-2" />
            <h3 className="text-xl font-semibold text-purple-800">
              Total Predictions
            </h3>
            <p className="text-4xl font-bold text-purple-600 mt-2">
              {totalPredictions}
            </p>
          </div>
          <div className="bg-green-50 p-6 rounded-xl shadow-md text-center">
            <ChartPieIcon className="h-10 w-10 text-green-500 mx-auto mb-2" />
            <h3 className="text-xl font-semibold text-green-800">
              Repaid Predictions
            </h3>
            <p className="text-4xl font-bold text-green-600 mt-2">
              {repaidCount}
            </p>
          </div>
          <div className="bg-red-50 p-6 rounded-xl shadow-md text-center">
            <ChartPieIcon className="h-10 w-10 text-red-500 mx-auto mb-2" />
            <h3 className="text-xl font-semibold text-red-800">
              Default Predictions
            </h3>
            <p className="text-4xl font-bold text-red-600 mt-2">
              {defaultCount}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Prediction Breakdown
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Latest Prediction
            </h2>
            {latestPrediction ? (
              <div className="space-y-3">
                <p className="text-gray-700">
                  <span className="font-semibold">Date:</span>{" "}
                  {latestPrediction.timestamp?.seconds
                    ? new Date(
                        latestPrediction.timestamp.seconds * 1000
                      ).toLocaleString()
                    : "N/A"}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Result:</span>{" "}
                  <span
                    className={`font-bold ${
                      latestPrediction.result?.includes("Repaid")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {latestPrediction.result}
                  </span>
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Confidence:</span>{" "}
                  {typeof latestPrediction.confidence === "number"
                    ? `${(latestPrediction.confidence * 100).toFixed(2)}%`
                    : "N/A"}
                </p>
                <div className="mt-4">
                  <Link
                    to="/history"
                    className="inline-flex items-center space-x-2 text-purple-500 hover:text-purple-600 font-medium px-4 py-2 rounded-lg border-2 border-purple-500 hover:border-purple-600 transition duration-300"
                  >
                    <ClockIcon className="h-5 w-5" />
                    <span>View All History</span>
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic">
                No predictions have been made yet.
              </p>
            )}
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            to="/predict"
            className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
          >
            <RocketLaunchIcon className="h-6 w-6" />
            <span>Make a New Prediction</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
