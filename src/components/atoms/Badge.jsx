import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    high: "bg-gradient-to-r from-error-50 to-error-100 text-error-700 border border-error-200 dark:from-error-900/20 dark:to-error-800/20 dark:text-error-400 dark:border-error-800",
    medium: "bg-gradient-to-r from-warning-50 to-warning-100 text-warning-700 border border-warning-200 dark:from-warning-900/20 dark:to-warning-800/20 dark:text-warning-400 dark:border-warning-800",
    low: "bg-gradient-to-r from-success-50 to-success-100 text-success-700 border border-success-200 dark:from-success-900/20 dark:to-success-800/20 dark:text-success-400 dark:border-success-800"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export default Badge;