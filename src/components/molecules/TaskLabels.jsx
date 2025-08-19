import { useState, useEffect } from 'react';
import { labelService } from '@/services/api/labelService';
import { cn } from '@/utils/cn';

const TaskLabels = ({ labels = [] }) => {
  const [labelData, setLabelData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLabels();
  }, [labels]);

  const loadLabels = async () => {
    try {
      setLoading(true);
      const allLabels = await labelService.getAll();
      const taskLabels = allLabels.filter(label => labels.includes(label.Id));
      setLabelData(taskLabels);
    } catch (err) {
      console.error('Failed to load label data:', err);
      setLabelData([]);
    } finally {
      setLoading(false);
    }
  };

  const getLabelColorClass = (color) => {
    const colorMap = {
      red: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200 dark:bg-red-950/80 dark:text-red-200 dark:border-red-800 dark:hover:bg-red-900/80',
      blue: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 dark:bg-blue-950/80 dark:text-blue-200 dark:border-blue-800 dark:hover:bg-blue-900/80',
      green: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200 dark:bg-green-950/80 dark:text-green-200 dark:border-green-800 dark:hover:bg-green-900/80',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200 dark:bg-yellow-950/80 dark:text-yellow-200 dark:border-yellow-800 dark:hover:bg-yellow-900/80',
      purple: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200 dark:bg-purple-950/80 dark:text-purple-200 dark:border-purple-800 dark:hover:bg-purple-900/80',
      gray: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200 dark:bg-gray-950/80 dark:text-gray-200 dark:border-gray-800 dark:hover:bg-gray-900/80',
      orange: 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200 dark:bg-orange-950/80 dark:text-orange-200 dark:border-orange-800 dark:hover:bg-orange-900/80',
      indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200 dark:bg-indigo-950/80 dark:text-indigo-200 dark:border-indigo-800 dark:hover:bg-indigo-900/80'
    };
    return colorMap[color] || colorMap.gray;
  };

  if (loading || labelData.length === 0) {
    return null;
  }

  // Show maximum 3 labels, with "+X more" indicator for additional labels
  const visibleLabels = labelData.slice(0, 3);
  const remainingCount = labelData.length - 3;

  return (
    <div className="flex flex-wrap gap-1 mb-2">
      {visibleLabels.map((label) => (
        <span
          key={label.Id}
          className={cn(
            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border transition-all duration-200 label-item",
            getLabelColorClass(label.color)
          )}
          title={label.description}
        >
          {label.name}
        </span>
      ))}
      {remainingCount > 0 && (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700">
          +{remainingCount} more
        </span>
      )}
    </div>
  );
};

export default TaskLabels;