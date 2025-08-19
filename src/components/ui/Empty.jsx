import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found",
  description = "Get started by adding your first item.",
  actionLabel = "Get Started",
  onAction,
  icon = "Inbox"
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center dark:from-gray-800 dark:to-gray-700">
        <ApperIcon name={icon} size={32} className="text-gray-400 dark:text-gray-500" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">
          {description}
        </p>
      </div>

      {onAction && (
        <Button onClick={onAction} className="min-w-[120px]">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;