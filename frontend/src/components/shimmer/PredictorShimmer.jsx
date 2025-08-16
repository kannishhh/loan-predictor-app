const PredictorShimmer = () => {
  return (
    <div className="bg-gray-100 font-sans">
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-10 border-b border-gray-200 pb-6 animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-purple-200 rounded-full"></div>
              <div className="h-8 w-64 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="h-10 w-28 bg-red-200 rounded-lg"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 animate-pulse">
            <div className="space-y-2">
              <div className="h-4 w-1/2 bg-gray-200 rounded-lg"></div>
              <div className="h-12 w-full bg-gray-100 rounded-lg"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-1/2 bg-gray-200 rounded-lg"></div>
              <div className="h-12 w-full bg-gray-100 rounded-lg"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-1/2 bg-gray-200 rounded-lg"></div>
              <div className="h-12 w-full bg-gray-100 rounded-lg"></div>
            </div>

            <div className="space-y-2">
              <div className="h-4 w-1/3 bg-gray-200 rounded-lg"></div>
              <div className="h-12 w-full bg-gray-100 rounded-lg"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-1/3 bg-gray-200 rounded-lg"></div>
              <div className="h-12 w-full bg-gray-100 rounded-lg"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-1/3 bg-gray-200 rounded-lg"></div>
              <div className="h-12 w-full bg-gray-100 rounded-lg"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-1/3 bg-gray-200 rounded-lg"></div>
              <div className="h-12 w-full bg-gray-100 rounded-lg"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-1/3 bg-gray-200 rounded-lg"></div>
              <div className="h-12 w-full bg-gray-100 rounded-lg"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-1/3 bg-gray-200 rounded-lg"></div>
              <div className="h-12 w-full bg-gray-100 rounded-lg"></div>
            </div>

            <div className="md:col-span-2 text-center mt-6">
              <div className="h-12 w-48 bg-purple-200 rounded-lg mx-10"></div>
            </div>
          </div>
        </div>
      </div>
      ;
    </div>
  );
};

export default PredictorShimmer;
