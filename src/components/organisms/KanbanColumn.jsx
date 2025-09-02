import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";
import TaskCard from "@/components/organisms/TaskCard";
import TaskDetailsModal from "@/components/organisms/TaskDetailsModal";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const KanbanColumn = ({
  column,
  tasks,
  onDragStart,
  onDragOver,
  onDrop,
  onColumnDragStart,
  onColumnDragOver,
  onColumnDrop,
  onAddTask,
  onTaskClick,
  onDeleteTask,
  draggedTask,
  draggedColumn,
  isDraggingColumn
}) => {
const isDragOver = draggedTask && draggedTask.column_c !== (column.title_c || column.id);
  const isColumnDragOver = draggedColumn && (draggedColumn.title_c || draggedColumn.id) !== (column.title_c || column.id);
  const isBeingDragged = (draggedColumn?.title_c || draggedColumn?.id) === (column.title_c || column.id);
  return (
<div
    className={cn(
        "flex-shrink-0 w-80 bg-white rounded-lg border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700",
        "transition-all duration-200",
        isDragOver && "ring-2 ring-primary-500 ring-opacity-50 bg-primary-50 dark:bg-primary-900/10",
        isColumnDragOver && "ring-2 ring-blue-500 ring-opacity-50 bg-blue-50 dark:bg-blue-900/10 transform scale-105",
        isBeingDragged && "opacity-50 transform rotate-1 shadow-drag",
        isDraggingColumn && "transition-transform duration-200"
    )}
    onDragOver={e => {
        onDragOver(e);
        onColumnDragOver(e);
    }}
    onDrop={e => {
        onDrop(e, column.id);
        onColumnDrop(e, column.id);
    }}
    draggable={true}
    onDragStart={e => onColumnDragStart(e, column)}>
    <div
        className={cn(
            "p-4 border-b border-gray-200 dark:border-gray-700 cursor-grab active:cursor-grabbing",
            isBeingDragged && "cursor-grabbing"
        )}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
{column.title_c || column.title || "Untitled"}
                    </h3>
                    <span
                        className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-gray-600 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                        {tasks.length}
                    </span>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onAddTask}
                    className="w-8 h-8 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <ApperIcon name="Plus" size={16} />
                </Button>
            </div>
        </div>
        <div className="flex-1 p-4 min-h-[500px]">
            {tasks.length === 0 ? <div className="h-full flex items-center justify-center">
                <Empty
                    title="No tasks"
                    description="Add a new task to get started"
                    actionLabel="Add Task"
                    onAction={onAddTask}
                    icon="ListTodo" />
            </div> : <div className="space-y-3 task-list max-h-[600px] overflow-y-auto">
{tasks.map(task => <TaskCard
                    key={task.Name}
                    task={task}
                    onDragStart={onDragStart}
                    onTaskClick={onTaskClick}
                    onDelete={onDeleteTask}
                    isDragging={draggedTask?.Name === task.Name} />)}
            </div>}
        </div>
    </div></div>
  );
};

export default KanbanColumn;