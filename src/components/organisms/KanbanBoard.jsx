import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import KanbanColumn from "@/components/organisms/KanbanColumn";
import TaskModal from "@/components/organisms/TaskModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { taskService } from "@/services/api/taskService";
import { columnService } from "@/services/api/columnService";

const KanbanBoard = ({ boardId }) => {
  const [tasks, setTasks] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [draggedTask, setDraggedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);

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
      toast.success(`Task moved to ${targetColumn?.title || "column"}`);
    } catch (err) {
      toast.error("Failed to move task");
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
      toast.success("Task created successfully");
    } catch (err) {
      toast.error("Failed to create task");
      console.error("Error creating task:", err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.Id !== taskId));
      toast.success("Task deleted successfully");
    } catch (err) {
      toast.error("Failed to delete task");
      console.error("Error deleting task:", err);
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
      </div>

      <div className="flex space-x-6 overflow-x-auto kanban-columns pb-6">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            tasks={getTasksForColumn(column.id)}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onAddTask={() => {
              setSelectedColumn(column.id);
              setShowTaskModal(true);
            }}
            onDeleteTask={handleDeleteTask}
            draggedTask={draggedTask}
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
    </div>
  );
};

export default KanbanBoard;