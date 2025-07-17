import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const History = () => {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    const fetchHistory = async () => {
      const res = await fetch("http://localhost:5000/history?email=" + email);
      const data = await res.json();
      setHistory(data);
    };
    fetchHistory();
  }, []);


  const clearHistory = async () => {
    try {
      const res = await fetch("http://localhost:5000/history?email=" + email, {
        method: "DELETE",
      });
      if (res.ok) {
        setHistory([]);
      } else {
        console.error("Failed to clear history");
      }
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  };

  return (
    <div className="bg-gray-50 font-sans text-gray-800 antialiased">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-blue-700 mb-8 sm:mb-10">
          Prediction History
        </h1>
        <div className="flex items-center justify-center mt-6">
          <div className="overflow-x-auto overflow-y-auto bg-white shadow-lg rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr className="bg-gray-900/40 text-lg">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Result
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Confidence
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {history.length === 0 ? (
                  <p className="m-2 text-md font-semibold">
                    No prediction history found.
                  </p>
                ) : (
                  <>
                    {history.map((h, i) => (
                      <tr key={i} className="hover:bg-blue-300">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
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
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
            <div className="mt-8 flex justify-evenly text-md">
              <button
                onClick={() => navigate(-1)}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 mb-2 rounded-lg shadow-md transition duration-300 ease-in-out transform"
              >
                Go Back
              </button>
              <button
                onClick={clearHistory}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 mb-2 rounded-lg shadow-md transition duration-300 ease-in-out transform "
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
