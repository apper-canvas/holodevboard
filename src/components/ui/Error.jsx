import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "Something went wrong", 
  description = "We encountered an error while loading your data.",
  onRetry,
  showRetry = true 
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-error-50 to-error-100 rounded-full flex items-center justify-center dark:from-error-900/20 dark:to-error-800/20">
        <ApperIcon name="AlertTriangle" size={32} className="text-error-500" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {message}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">
          {description}
        </p>
      </div>

      {showRetry && onRetry && (
        <Button onClick={onRetry} className="min-w-[120px]">
          <ApperIcon name="RefreshCw" size={16} className="mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default Error;