const UserDashboardShimmer = () => {
  return (
    <div className="bg-gray-50 font-sans">
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-lg">
          <div className="flex items-center mb-8 border-b border-gray-200 pb-4 animate-pulse">
            <div className="h-10 w-10 bg-purple-200 rounded-full mr-3"></div>
            <div className="h-8 w-64 bg-gray-200 rounded-lg"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 animate-pulse">
            <div className="bg-gray-100 p-6 rounded-xl shadow-md text-center space-y-4">
              <div className="h-10 w-10 bg-gray-200 rounded-full mx-auto"></div>
              <div className="h-6 w-3/4 bg-gray-200 rounded-lg mx-auto"></div>
              <div className="h-12 w-1/2 bg-gray-300 rounded-lg mx-auto"></div>
            </div>
            <div className="bg-gray-100 p-6 rounded-xl shadow-md text-center space-y-4">
              <div className="h-10 w-10 bg-gray-200 rounded-full mx-auto"></div>
              <div className="h-6 w-3/4 bg-gray-200 rounded-lg mx-auto"></div>
              <div className="h-12 w-1/2 bg-gray-300 rounded-lg mx-auto"></div>
            </div>
            <div className="bg-gray-100 p-6 rounded-xl shadow-md text-center space-y-4">
              <div className="h-10 w-10 bg-gray-200 rounded-full mx-auto"></div>
              <div className="h-6 w-3/4 bg-gray-200 rounded-lg mx-auto"></div>
              <div className="h-12 w-1/2 bg-gray-300 rounded-lg mx-auto"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 animate-pulse">
            <div className="bg-gray-100 p-6 rounded-xl shadow-lg border border-gray-200 space-y-4">
              <div className="h-8 w-2/3 bg-gray-200 rounded-lg"></div>
              <div className="h-56 w-56 bg-gray-300 rounded-full mx-auto"></div>
            </div>
            <div className="bg-gray-100 p-6 rounded-xl shadow-lg border border-gray-200 space-y-4">
              <div className="h-8 w-2/3 bg-gray-200 rounded-lg"></div>
              <div className="space-y-3 mt-4">
                <div className="h-4 w-full bg-gray-200 rounded-lg"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded-lg"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="h-12 w-full bg-purple-200 rounded-lg mx-auto mt-6"></div>
            </div>
          </div>

          <div className="text-center mt-8 animate-pulse">
            <div className="h-12 w-64 bg-purple-200 rounded-lg mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardShimmer;
