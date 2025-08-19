import { cn } from "@/utils/cn";

const FormField = ({ label, children, error, required, className }) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="text-sm text-error-500 mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormField;