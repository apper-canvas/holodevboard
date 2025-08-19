import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    primary: "bg-gradient-primary text-white shadow-sm hover:opacity-90 active:scale-[0.98]",
    secondary: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 active:scale-[0.98] dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:scale-[0.98] dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100",
    danger: "bg-gradient-to-r from-error-500 to-error-600 text-white shadow-sm hover:opacity-90 active:scale-[0.98]",
    success: "bg-gradient-success text-white shadow-sm hover:opacity-90 active:scale-[0.98]"
  };

  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
    icon: "h-10 w-10"
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;