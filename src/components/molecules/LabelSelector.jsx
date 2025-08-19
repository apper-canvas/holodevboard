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
      red: 'bg-red-100 border-red-300 text-red-700 dark:bg-red-900/20 dark:border-red-600 dark:text-red-400',
      blue: 'bg-blue-100 border-blue-300 text-blue-700 dark:bg-blue-900/20 dark:border-blue-600 dark:text-blue-400',
      green: 'bg-green-100 border-green-300 text-green-700 dark:bg-green-900/20 dark:border-green-600 dark:text-green-400',
      yellow: 'bg-yellow-100 border-yellow-300 text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-600 dark:text-yellow-400',
      purple: 'bg-purple-100 border-purple-300 text-purple-700 dark:bg-purple-900/20 dark:border-purple-600 dark:text-purple-400',
      gray: 'bg-gray-100 border-gray-300 text-gray-700 dark:bg-gray-900/20 dark:border-gray-600 dark:text-gray-400',
      orange: 'bg-orange-100 border-orange-300 text-orange-700 dark:bg-orange-900/20 dark:border-orange-600 dark:text-orange-400',
      indigo: 'bg-indigo-100 border-indigo-300 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-600 dark:text-indigo-400'
    };
    return colorMap[color] || colorMap.gray;
  };

  const getSelectedColorClass = (color) => {
    const colorMap = {
      red: 'bg-red-500 border-red-500 text-white',
      blue: 'bg-blue-500 border-blue-500 text-white',
      green: 'bg-green-500 border-green-500 text-white',
      yellow: 'bg-yellow-500 border-yellow-500 text-white',
      purple: 'bg-purple-500 border-purple-500 text-white',
      gray: 'bg-gray-500 border-gray-500 text-white',
      orange: 'bg-orange-500 border-orange-500 text-white',
      indigo: 'bg-indigo-500 border-indigo-500 text-white'
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