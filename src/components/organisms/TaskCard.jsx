import { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { format } from "date-fns";

const TaskCard = ({ task, onDragStart, onDelete, isDragging }) => {
  const [showActions, setShowActions] = useState(false);

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this task?")) {
      onDelete(task.Id);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "high";
      case "medium": return "medium";
      case "low": return "low";
      default: return "default";
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      className={cn(
        "group relative bg-white border border-gray-200 rounded-lg p-4 shadow-card hover:shadow-card-hover transition-all duration-200 cursor-grab active:cursor-grabbing dark:bg-gray-700 dark:border-gray-600",
        "hover:-translate-y-0.5 hover:scale-[1.02]",
        isDragging && "task-dragging opacity-50"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <Badge variant={getPriorityColor(task.priority)} className="text-xs">
          {task.priority?.toUpperCase() || "MEDIUM"}
        </Badge>
        
        {showActions && (
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={handleDeleteClick}
            >
              <ApperIcon name="Trash2" size={14} />
            </Button>
          </div>
        )}
      </div>

      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
        {task.title}
      </h4>

      {task.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-white">
              {task.assignee?.charAt(0) || "U"}
            </span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {task.assignee || "Unassigned"}
          </span>
        </div>

        {task.createdAt && (
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {format(new Date(task.createdAt), "MMM d")}
          </span>
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
    </div>
  );
};

export default TaskCard;