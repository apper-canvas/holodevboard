import React, { useState } from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const TaskCard = ({ task, onDragStart, onDelete, onTaskClick, isDragging }) => {
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

const getLabelColorClass = (color) => {
    const colorMap = {
      red: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/50 dark:text-red-200 dark:border-red-600',
      blue: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-200 dark:border-blue-600',
      green: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/50 dark:text-green-200 dark:border-green-600',
      yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-200 dark:border-yellow-600',
      purple: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/50 dark:text-purple-200 dark:border-purple-600',
      gray: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/50 dark:text-gray-200 dark:border-gray-600',
      orange: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/50 dark:text-orange-200 dark:border-orange-600',
      indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-200 dark:border-indigo-600'
    };
    return colorMap[color] || colorMap.gray;
  };

  return (
<div
    onClick={() => onTaskClick && onTaskClick(task)}
    className="cursor-pointer">
    <div
        draggable
        onDragStart={e => onDragStart(e, task)}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
        className={cn(
            "group relative bg-white border border-gray-200 rounded-lg p-4 shadow-card hover:shadow-card-hover transition-all duration-200 cursor-grab active:cursor-grabbing dark:bg-gray-700 dark:border-gray-600",
            "hover:-translate-y-0.5 hover:scale-[1.02]",
            isDragging && "task-dragging opacity-50"
        )}>
        <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
                <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                    {task.priority?.toUpperCase() || "MEDIUM"}
                </Badge>
            </div>
            {showActions && <div
                className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={handleDeleteClick}>
                    <ApperIcon name="Trash2" size={14} />
                </Button>
            </div>}
        </div>
        {task.labels && task.labels.length > 0 && <div className="flex flex-wrap gap-1 mb-3">
            {task.labels.map((label, index) => <span
                key={index}
                className={cn(
                    "px-2 py-1 text-xs font-medium rounded-full border",
                    getLabelColorClass(label.color)
                )}>
                {label.name}
            </span>)}
        </div>}
        <h4
            className="font-medium text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
            {task.title}
        </h4>
        {task.description && <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
            {task.description}
        </p>}
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <div
                    className="w-6 h-6 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-white">
                        {task.assignee?.charAt(0) || "U"}
                    </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    {task.assignee || "Unassigned"}
                </span>
            </div>
            {task.createdAt && <span className="text-xs text-gray-400 dark:text-gray-500">
                {format(new Date(task.createdAt), "MMM d")}
            </span>}
        </div>
        <div
            className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
    </div></div>
  );
};

export default TaskCard;