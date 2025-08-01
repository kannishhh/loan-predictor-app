import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { PredictionContext } from "../../App";

const AllPredictions = () => {
  const { allPredictions } = useContext(PredictionContext);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredData = allPredictions.filter((item) => {
    const userIdentifier = item.email || item.userId || "";
    const matchesSearch = userIdentifier
      .toLowerCase()
      .includes(search.toLowerCase());

    const predictionStatus = item.result?.includes("Repaid")
      ? "Approved"
      : "Rejected";
    const matchesStatus =
      filterStatus === "All" || predictionStatus === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-6 flex flex-col items-center">
      <div className="w-full max-w-6xl bg-white p-8 rounded-xl shadow-lg transform transition-all duration-300 ease-in-out hover:shadow-xl">

        <div className="flex justify-between items-center mb-10 border-b border-gray-200 pb-6">
          <h1 className="text-4xl font-extrabold text-gray-700 tracking-tight flex items-center">
            <ClipboardDocumentListIcon className="h-10 w-10 text-purple-500 mr-3" />
            All Predictions
          </h1>
        </div>
        <p className="text-gray-600 text-lg mb-8">
          Overview of all user prediction requests and their outcomes.
        </p>

        <div className="flex justify-between items-center mb-6">
          <Link
            to="/admin"
            className="inline-flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-5 rounded-lg shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search by user..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
              />
            </div>

            <div className="relative">
              <AdjustmentsHorizontalIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
              >
                <option value="All">All Statuses</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto w-full bg-white rounded-xl shadow-lg mt-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Model
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.length > 0 ? (
              filteredData.map((pred) => (
                <tr
                  key={pred.id}
                  className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                >
                  <td className="py-3 px-6 text-gray-800">
                    {pred.email || pred.userId || "N/A"}
                  </td>
                  <td
                    className={`py-3 px-6 font-semibold ${
                      pred.result?.includes("Repaid")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {pred.result?.includes("Repaid") ? "Approved" : "Rejected"}
                  </td>
                  <td className="py-3 px-6 text-gray-800">In-memory Model</td>
                  <td className="py-3 px-6 text-gray-800">{pred.timestamp}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-8 text-center text-gray-500">
                  No predictions found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllPredictions;
