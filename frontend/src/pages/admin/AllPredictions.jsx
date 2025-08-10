import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

import { PredictionContext } from "../../context/PredictionContext";
import { creditScoreOptions } from "../../constants/predictorConstants";

const AllPredictions = () => {
  const { allPredictions } = useContext(PredictionContext);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterCreditScore, setFilterCreditScore] = useState("All");

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

    const matchesCreditScoreType =
      filterCreditScore === "All" ||
      item.input.credit_score_type === filterCreditScore;

    return matchesSearch && matchesStatus && matchesCreditScoreType;
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-6">
      <div className="w-full bg-white p-8 rounded-xl shadow-lg mb-8">
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
          <div className="flex items-center">
            <ClipboardDocumentListIcon className="h-10 w-10 text-purple-500 mr-3" />
            <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
              All Predictions
            </h1>
          </div>
        </div>
        <p className="text-gray-500 text-lg">
          Overview of all user prediction requests and their outcomes.
        </p>

        <div className="flex justify-between items-center mt-8">
          <div className="relative w-full sm:w-1/3">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ease-in-out text-gray-800"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <AdjustmentsHorizontalIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-900 pointer-events-none" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
              >
                <option value="All">All Statuses</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>

            <div className="relative">
              <AdjustmentsHorizontalIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-900 pointer-events-none" />
              <select
                value={filterCreditScore}
                onChange={(e) => setFilterCreditScore(e.target.value)}
                className="pl-10 pr-5 py-2 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none transition-all duration-200 ease-in-out text-gray-800 bg-white"
              >
                <option value="All">All Credit Scores</option>
                {creditScoreOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-500">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto bg-white rounded-xl shadow-[0_4px_6px_rgba(0,0,0,0.05),0_10px_15px_rgba(0,0,0,0.03)]">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-200 rounded-t-xl">
            <tr>
              <th className="py-4 px-6 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider rounded-tl-xl">
                User
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
                Status
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
                Model
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
                Credit Type
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider rounded-tr-xl">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-500">
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
                  <td className="py-3 px-6 text-gray-800">
                    {creditScoreOptions.find(
                      (opt) => opt.value === pred.input.credit_score_type
                    )?.label || "N/A"}
                  </td>
                  <td className="py-3 px-6 text-gray-800">{pred.timestamp}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-500">
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
