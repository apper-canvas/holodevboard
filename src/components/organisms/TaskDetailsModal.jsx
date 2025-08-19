import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import FormField from '@/components/molecules/FormField';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import TextArea from '@/components/atoms/TextArea';
import Select from '@/components/atoms/Select';
import LabelSelector from '@/components/molecules/LabelSelector';
import { cn } from '@/utils/cn';

const TaskDetailsModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  task, 
  columns 
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    column: "",
    assignee: "Developer",
    dueDate: "",
    labels: []
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Update form data when task changes
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "medium",
        column: task.column || "",
        assignee: task.assignee || "Developer",
        dueDate: task.dueDate || "",
        labels: task.labels || []
      });
    }
  }, [task]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (formData.dueDate && new Date(formData.dueDate) < new Date().setHours(0, 0, 0, 0)) {
      newErrors.dueDate = "Due date cannot be in the past";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setIsLoading(true);
    try {
      const taskData = {
        ...formData,
        updatedAt: new Date().toISOString()
      };

      await onSubmit(task.Id, taskData);
      toast.success("Task updated successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to update task");
      console.error("Error updating task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleLabelToggle = (labelId) => {
    setFormData(prev => ({
      ...prev,
      labels: prev.labels.includes(labelId)
        ? prev.labels.filter(id => id !== labelId)
        : [...prev.labels, labelId]
    }));
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      onClose();
      // Delete will be handled by parent component
    }
  };

  const priorityOptions = [
    { value: "low", label: "Low Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "high", label: "High Priority" },
    { value: "urgent", label: "Urgent" }
  ];

  const assigneeOptions = [
    { value: "Developer", label: "Developer" },
    { value: "Designer", label: "Designer" },
    { value: "Product Manager", label: "Product Manager" },
    { value: "QA Engineer", label: "QA Engineer" }
  ];

  if (!task) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl dark:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <ApperIcon name="Edit3" size={20} className="text-primary-500" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Task Details
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                >
                  <ApperIcon name="Trash2" size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <FormField 
                label="Task Title" 
                error={errors.title}
                required
              >
                <Input
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Enter task title..."
                  className={cn(errors.title && "border-red-500 focus:border-red-500")}
                />
              </FormField>

              <FormField label="Description">
                <TextArea
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Describe the task details..."
                  rows={4}
                  className="resize-none"
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Priority">
                  <Select
                    value={formData.priority}
                    onChange={(e) => handleChange("priority", e.target.value)}
                  >
                    {priorityOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </FormField>

                <FormField label="Column">
                  <Select
                    value={formData.column}
                    onChange={(e) => handleChange("column", e.target.value)}
                  >
                    {columns.map(column => (
                      <option key={column.id} value={column.id}>
                        {column.title}
                      </option>
                    ))}
                  </Select>
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Assignee">
                  <Select
                    value={formData.assignee}
                    onChange={(e) => handleChange("assignee", e.target.value)}
                  >
                    {assigneeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </FormField>

                <FormField 
                  label="Due Date" 
                  error={errors.dueDate}
                >
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleChange("dueDate", e.target.value)}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    className={cn(errors.dueDate && "border-red-500 focus:border-red-500")}
                  />
                </FormField>
              </div>

              <FormField label="Labels">
                <LabelSelector
                  selectedLabels={formData.labels}
                  onLabelToggle={handleLabelToggle}
                />
              </FormField>

              {task.createdAt && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Created: {format(new Date(task.createdAt), 'MMM d, yyyy')}</span>
                    {task.updatedAt && (
                      <span>Updated: {format(new Date(task.updatedAt), 'MMM d, yyyy')}</span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="min-w-[120px]"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Saving...
                    </div>
                  ) : (
                    <>
                      <ApperIcon name="Save" size={16} className="mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaskDetailsModal;