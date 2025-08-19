const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin dark:border-gray-700"></div>
        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-primary-300 rounded-full animate-spin animation-delay-75"></div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{message}</p>
    </div>
  );
};

export default Loading;