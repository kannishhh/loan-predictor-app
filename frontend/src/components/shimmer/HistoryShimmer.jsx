const HistoryShimmer = () => {
  return (
    <div className="bg-gray-50 font-sans">
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-5xl bg-white p-8 rounded-xl shadow-lg animate-pulse">
          <div className="flex justify-center items-center mb-10 border-b border-gray-200 pb-6">
            <div className="h-10 w-10 bg-purple-200 rounded-full mr-3"></div>
            <div className="h-8 w-64 bg-gray-200 rounded-lg"></div>
          </div>

          <div className="mt-8 overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <div className="h-4 w-24 bg-gray-300 rounded-lg"></div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <div className="h-4 w-24 bg-gray-300 rounded-lg"></div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <div className="h-4 w-24 bg-gray-300 rounded-lg"></div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 w-40 bg-gray-200 rounded-lg"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 w-32 bg-gray-200 rounded-lg"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 w-24 bg-gray-200 rounded-lg"></div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 w-48 bg-gray-200 rounded-lg"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 w-36 bg-gray-200 rounded-lg"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 w-20 bg-gray-200 rounded-lg"></div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 w-40 bg-gray-200 rounded-lg"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 w-32 bg-gray-200 rounded-lg"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 w-24 bg-gray-200 rounded-lg"></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row justify-center sm:justify-evenly gap-4">
            <div className="h-12 w-40 bg-gray-200 rounded-lg mx-auto"></div>
            <div className="h-12 w-40 bg-red-200 rounded-lg mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryShimmer;
