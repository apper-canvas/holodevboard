import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import FormField from '@/components/molecules/FormField';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { labelService } from '@/services/api/labelService';
import { cn } from '@/utils/cn';

const LabelSelector = ({ selectedLabels = [], onLabelToggle }) => {
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLabels();
  }, []);

  const loadLabels = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await labelService.getAll();
      setLabels(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load labels');
    } finally {
      setLoading(false);
    }
  };

const getLabelColorClass = (color) => {
    const colorMap = {
      red: 'bg-red-50 border-red-200 text-red-800 hover:bg-red-100 dark:bg-red-950 dark:border-red-800 dark:text-red-200 dark:hover:bg-red-900',
      blue: 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-200 dark:hover:bg-blue-900',
      green: 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100 dark:bg-green-950 dark:border-green-800 dark:text-green-200 dark:hover:bg-green-900',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-200 dark:hover:bg-yellow-900',
      purple: 'bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100 dark:bg-purple-950 dark:border-purple-800 dark:text-purple-200 dark:hover:bg-purple-900',
      gray: 'bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100 dark:bg-gray-950 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-900',
      orange: 'bg-orange-50 border-orange-200 text-orange-800 hover:bg-orange-100 dark:bg-orange-950 dark:border-orange-800 dark:text-orange-200 dark:hover:bg-orange-900',
      indigo: 'bg-indigo-50 border-indigo-200 text-indigo-800 hover:bg-indigo-100 dark:bg-indigo-950 dark:border-indigo-800 dark:text-indigo-200 dark:hover:bg-indigo-900'
    };
    return colorMap[color] || colorMap.gray;
  };

  const getSelectedColorClass = (color) => {
    const colorMap = {
      red: 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-500/25 hover:bg-red-700 dark:bg-red-500 dark:border-red-500 dark:hover:bg-red-600',
      blue: 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 dark:bg-blue-500 dark:border-blue-500 dark:hover:bg-blue-600',
      green: 'bg-green-600 border-green-600 text-white shadow-lg shadow-green-500/25 hover:bg-green-700 dark:bg-green-500 dark:border-green-500 dark:hover:bg-green-600',
      yellow: 'bg-yellow-600 border-yellow-600 text-white shadow-lg shadow-yellow-500/25 hover:bg-yellow-700 dark:bg-yellow-500 dark:border-yellow-500 dark:hover:bg-yellow-600',
      purple: 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-500/25 hover:bg-purple-700 dark:bg-purple-500 dark:border-purple-500 dark:hover:bg-purple-600',
      gray: 'bg-gray-600 border-gray-600 text-white shadow-lg shadow-gray-500/25 hover:bg-gray-700 dark:bg-gray-500 dark:border-gray-500 dark:hover:bg-gray-600',
      orange: 'bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-500/25 hover:bg-orange-700 dark:bg-orange-500 dark:border-orange-500 dark:hover:bg-orange-600',
      indigo: 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 dark:bg-indigo-500 dark:border-indigo-500 dark:hover:bg-indigo-600'
    };
    return colorMap[color] || colorMap.gray;
  };

  if (loading) {
    return (
      <FormField label="Labels">
        <div className="flex items-center justify-center py-8">
          <Loading size="sm" />
        </div>
      </FormField>
    );
  }

  if (error) {
    return (
      <FormField label="Labels">
        <Error message={error} />
      </FormField>
    );
  }

  return (
    <FormField label="Labels">
      <div className="grid grid-cols-2 gap-2">
        {labels.map((label) => {
          const isSelected = selectedLabels.includes(label.Id);
          return (
            <label
              key={label.Id}
              className={cn(
                "flex items-center space-x-2 p-2 rounded-md border cursor-pointer transition-all duration-200 hover:shadow-sm",
                isSelected 
                  ? getSelectedColorClass(label.color)
                  : getLabelColorClass(label.color)
              )}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onLabelToggle(label.Id)}
                className="sr-only"
              />
              <div className={cn(
                "w-3 h-3 rounded-full border-2 flex items-center justify-center",
                isSelected ? "border-white" : "border-current"
              )}>
                {isSelected && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
              <span className="text-sm font-medium truncate">
                {label.name}
              </span>
            </label>
          );
        })}
      </div>
      {selectedLabels.length > 0 && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {selectedLabels.length} label{selectedLabels.length !== 1 ? 's' : ''} selected
        </p>
      )}
    </FormField>
  );
};

export default LabelSelector;