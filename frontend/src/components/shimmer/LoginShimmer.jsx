const LoginShimmer = () => {
  return (
    <div className="bg-gray-100 font-sans">
      <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-r from-purple-500 to-teal-500 ">
        <div className="hidden lg:flex w-full max-w-lg min-h-[500px] bg-black/70 p-12 rounded-xl shadow-2xl flex-col items-center justify-center animate-pulse">
          <div className="h-24 w-24 bg-gray-600 rounded-full mb-8"></div>
          <div className="h-8 w-2/3 bg-gray-600 rounded-lg mb-4"></div>
          <div className="h-4 w-1/2 bg-gray-600 rounded-lg"></div>
        </div>

        <div className="w-full max-w-lg mx-auto bg-white p-8 sm:p-12 rounded-xl shadow-2xl min-h-[500px]">
          <div className="h-8 w-2/3 bg-gray-300 rounded-lg animate-pulse mb-8"></div>
          <div className="space-y-6">
            <div>
              <div className="h-4 w-1/3 bg-gray-300 rounded-lg animate-pulse mb-2"></div>
              <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div>
              <div className="h-4 w-1/3 bg-gray-300 rounded-lg animate-pulse mb-2"></div>
              <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"></div>
          </div>

          <div className="flex flex-col items-center mt-6 space-y-4">
            <div className="h-4 w-1/2 bg-gray-300 rounded-lg animate-pulse"></div>
            <div className="flex items-center w-full space-x-2 my-4">
              <div className="flex-1 h-px bg-gray-300 animate-pulse"></div>
              <div className="h-4 w-1/4 bg-gray-300 rounded-lg animate-pulse"></div>
              <div className="flex-1 h-px bg-gray-300 animate-pulse"></div>
            </div>
            <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginShimmer;
