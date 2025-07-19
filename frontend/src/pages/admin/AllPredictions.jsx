import { useState } from "react";
import {
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";

const dummyPredictions = [
  {
    id: 1,
    user: "Ravi Kumar",
    date: "2025-07-15",
    status: "Approved",
    model: "Logistic Regression",
  },
  {
    id: 2,
    user: "Pooja Sharma",
    date: "2025-07-14",
    status: "Rejected",
    model: "Decision Tree",
  },
  {
    id: 3,
    user: "Alice",
    date: "2025-07-14",
    status: "Approved",
    model: "Logistic Regression",
  },
  {
    id: 4,
    user: "Bob",
    date: "2025-07-13",
    status: "Rejected",
    model: "DecisionTree",
  },
  {
    id: 5,
    user: "Charlie",
    date: "2025-07-12",
    status: "Approved",
    model: "Logistic Regression",
  },
  {
    id: 6,
    user: "David",
    date: "2025-07-11",
    status: "Approved",
    model: "Random Forest",
  },
  {
    id: 7,
    user: "Eve",
    date: "2025-07-10",
    status: "Rejected",
    model: "SVM",
  },
  {
    id: 8,
    user: "Frank",
    date: "2025-07-09",
    status: "Approved",
    model: "Neural Network",
  },
  {
    id: 9,
    user: "Grace",
    date: "2025-07-08",
    status: "Rejected",
    model: "Logistic Regression",
  },
  {
    id: 10,
    user: "Heidi",
    date: "2025-07-07",
    status: "Approved",
    model: "Decision Tree",
  },
];

const AllPredictions = () => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredData = dummyPredictions.filter((item) => {
    const matchesSearch = item.user
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 tracking-tight flex items-center">
          <ClipboardDocumentListIcon className="h-10 w-10 text-purple-500 mr-3" />
          All Predictions
        </h1>
        <p className="text-gray-500 text-lg mb-8">
          Overview of all user prediction requests and their outcomes.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 p-6 bg-white rounded-xl shadow-[0_4px_6px_rgba(0,0,0,0.05),0_10px_15px_rgba(0,0,0,0.03)]">
        <div className="relative w-full sm:w-auto flex-grow">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-500 rounded-lg w-full
                       focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                       transition-all duration-200 ease-in-out text-gray-800"
          />
        </div>

        <div className="relative w-full sm:w-auto">
          <AdjustmentsHorizontalIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-900 pointer-events-none" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-500 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none transition-all duration-200 ease-in-out text-gray-800 bg-white"
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
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-[0_4px_6px_rgba(0,0,0,0.05),0_10px_15px_rgba(0,0,0,0.03)]">
        <table className="w-full min-w-full divide-y divide-gray-500">
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
                  <td className="py-3 px-6 text-gray-800">{pred.user}</td>
                  <td
                    className={`py-3 px-6 font-semibold ${
                      pred.status === "Approved"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {pred.status}
                  </td>
                  <td className="py-3 px-6 text-gray-800">{pred.model}</td>
                  <td className="py-3 px-6 text-gray-800">{pred.date}</td>
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
