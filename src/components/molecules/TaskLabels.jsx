import { useState, useEffect } from 'react';
import { labelService } from '@/services/api/labelService';
import { cn } from '@/utils/cn';

const TaskLabels = ({ labels = [], getLabelColorClass }) => {
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
            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border transition-colors duration-200",
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