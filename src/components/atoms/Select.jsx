import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Select = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div className="relative">
      <select
        className={cn(
          "flex h-10 w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 pr-8 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-primary-400 dark:focus:ring-primary-400",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      <ApperIcon 
        name="ChevronDown" 
        size={16} 
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" 
      />
    </div>
  );
});

Select.displayName = "Select";

export default Select;