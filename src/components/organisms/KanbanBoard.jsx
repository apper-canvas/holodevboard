import React, { useEffect, useState } from "react";
import { taskService } from "@/services/api/taskService";
import { columnService } from "@/services/api/columnService";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import ColumnModal from "@/components/organisms/ColumnModal";
import KanbanColumn from "@/components/organisms/KanbanColumn";
import TaskModal from "@/components/organisms/TaskModal";
import { cn } from "@/utils/cn";

const KanbanBoard = ({ boardId }) => {
  const [tasks, setTasks] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const [draggedTask, setDraggedTask] = useState(null);
  const [draggedColumn, setDraggedColumn] = useState(null);
const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);
const [showColumnModal, setShowColumnModal] = useState(false);
  const [isDraggingColumn, setIsDraggingColumn] = useState(false);
const loadData = async () => {
    if (!boardId) return;
    
    try {
      setLoading(true);
      setError("");
      
      const [tasksData, columnsData] = await Promise.all([
        taskService.getAll(boardId),
        columnService.getAll(boardId)
      ]);
      
      setTasks(tasksData);
      setColumns(columnsData);
    } catch (err) {
      setError("Failed to load board data");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [boardId]); // Reload when boardId changes
// Column drag handlers
  const handleColumnDragStart = (e, column) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedColumn(column);
    setIsDraggingColumn(true);
    e.dataTransfer.setData('text/plain', '');
  };

  const handleColumnDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleColumnDrop = async (e, targetColumnId) => {
    e.preventDefault();
    
    if (!draggedColumn || draggedColumn.id === targetColumnId) {
      setDraggedColumn(null);
      setIsDraggingColumn(false);
      return;
    }

    try {
      const sourceIndex = columns.findIndex(col => col.id === draggedColumn.id);
      const targetIndex = columns.findIndex(col => col.id === targetColumnId);
      
      if (sourceIndex === -1 || targetIndex === -1) return;

      const reorderedColumns = [...columns];
      const [movedColumn] = reorderedColumns.splice(sourceIndex, 1);
      reorderedColumns.splice(targetIndex, 0, movedColumn);

      // Update positions
      const updatedColumns = reorderedColumns.map((col, index) => ({
        ...col,
        position: index + 1
      }));

      setColumns(updatedColumns);
      
      // Update positions in service
      await columnService.updatePositions(updatedColumns.map(col => ({
        id: col.id,
        position: col.position
      })));

    } catch (err) {
      console.error("Error reordering columns:", err);
      // Revert on error
      loadData();
    } finally {
      setDraggedColumn(null);
      setIsDraggingColumn(false);
    }
  };
  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e, targetColumnId) => {
    e.preventDefault();
    
    if (!draggedTask || draggedTask.column === targetColumnId) {
      setDraggedTask(null);
      return;
    }

    try {
      const updatedTask = { ...draggedTask, column: targetColumnId };
      await taskService.update(draggedTask.Id, updatedTask);
      
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.Id === draggedTask.Id 
            ? { ...task, column: targetColumnId }
            : task
        )
      );

const targetColumn = columns.find(col => col.id === targetColumnId);
    } catch (err) {
      console.error("Error moving task:", err);
    } finally {
      setDraggedTask(null);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      setTasks(prevTasks => [...prevTasks, newTask]);
setShowTaskModal(false);
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId);
setTasks(prevTasks => prevTasks.filter(task => task.Id !== taskId));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };
const handleCreateColumn = () => {
  setShowColumnModal(true);
};

const handleCreateColumnSubmit = async (columnData) => {
  try {
    const newColumn = await columnService.create({ title: columnData.title.trim() });
    setColumns(prevColumns => [...prevColumns, newColumn]);
    setShowColumnModal(false);
  } catch (err) {
    console.error("Error creating column:", err);
  }
};
const getTasksForColumn = (columnId) => {
return tasks.filter(task => task.column === columnId);
};
  if (loading) {
    return <Loading message="Loading your board..." />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <div className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
<div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Development Board
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Track your development tasks across the workflow
          </p>
        </div>
<button
          onClick={handleCreateColumn}
          className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Column
        </button>
      </div>

<div className={cn(
        "flex space-x-6 overflow-x-auto kanban-columns pb-6",
        isDraggingColumn && "select-none"
      )}>
{columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            tasks={getTasksForColumn(column.id)}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onColumnDragStart={handleColumnDragStart}
            onColumnDragOver={handleColumnDragOver}
            onColumnDrop={handleColumnDrop}
            onAddTask={() => {
              setSelectedColumn(column.id);
              setShowTaskModal(true);
            }}
            onDeleteTask={handleDeleteTask}
            draggedTask={draggedTask}
            draggedColumn={draggedColumn}
            isDraggingColumn={isDraggingColumn}
          />
        ))}
      </div>

      {showTaskModal && (
        <TaskModal
          isOpen={showTaskModal}
          onClose={() => {
            setShowTaskModal(false);
            setSelectedColumn(null);
          }}
          onSubmit={handleCreateTask}
          defaultColumn={selectedColumn}
          columns={columns}
/>
      )}

      <ColumnModal
        isOpen={showColumnModal}
        onClose={() => setShowColumnModal(false)}
        onSubmit={handleCreateColumnSubmit}
      />
    </div>
  );
};

export default KanbanBoard;