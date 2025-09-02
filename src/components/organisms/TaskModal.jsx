import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import LabelSelector from "@/components/molecules/LabelSelector";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import TextArea from "@/components/atoms/TextArea";
import Select from "@/components/atoms/Select";
import { cn } from "@/utils/cn";

const TaskModal = ({ isOpen, onClose, onSubmit, defaultColumn, columns }) => {
const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    column: defaultColumn || (columns[0]?.title_c || columns[0]?.id || "backlog"),
    assignee: "Developer",
    dueDate: "",
    labels: []
  });
const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await onSubmit(taskData);
      toast.success("Task created successfully");
      
      // Reset form
setFormData({
        title: "",
        description: "",
        priority: "medium",
        column: defaultColumn || (columns[0]?.title_c || columns[0]?.id || "backlog"),
        assignee: "Developer",
        dueDate: "",
        labels: []
      });
      setErrors({});
    } catch (error) {
      toast.error("Failed to create task");
      console.error("Error creating task:", error);
    } finally {
      setIsLoading(false);
    }
  };

const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={onClose}
        />
        
<motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm sm:max-w-lg mx-4 max-h-[90vh] flex flex-col dark:bg-gray-800"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Create New Task
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="w-8 h-8"
            >
              <ApperIcon name="X" size={20} />
            </Button>
          </div>

<div className="flex-1 overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <FormField
                label="Task Title"
                required
                error={errors.title}
              >
                <Input
                  placeholder="Enter task title..."
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className={errors.title ? "border-error-500 focus:border-error-500 focus:ring-error-500" : ""}
                />
              </FormField>

              <FormField label="Description">
                <TextArea
                  placeholder="Describe the task..."
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="min-h-[80px]"
                />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Priority">
                  <Select
                    value={formData.priority}
                    onChange={(e) => handleChange("priority", e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </Select>
                </FormField>

                <FormField label="Column">
                  <Select
                    value={formData.column}
                    onChange={(e) => handleChange("column", e.target.value)}
                  >
{columns.map((column) => (
                      <option key={column.title_c || column.id} value={column.title_c || column.id}>
                        {column.title_c || column.title}
                      </option>
                    ))}
                  </Select>
                </FormField>
              </div>
<FormField 
                label="Due Date" 
                error={errors.dueDate}
              >
                <Input
                  type="date"
value={formData.dueDate}
                  onChange={(e) => handleChange("dueDate", e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className={cn(errors.dueDate && "border-red-500 focus:border-red-500")}
                />
              </FormField>
              <FormField label="Assignee">
                <Select
                  value={formData.assignee}
                  onChange={(e) => handleChange("assignee", e.target.value)}
                >
                  <option value="Developer">Developer</option>
                  <option value="Designer">Designer</option>
                  <option value="QA">QA Engineer</option>
                  <option value="Manager">Project Manager</option>
                </Select>
              </FormField>

              <LabelSelector
                selectedLabels={formData.labels}
                onLabelToggle={handleLabelToggle}
              />

              <div className="flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={onClose} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button type="submit" className="w-full sm:w-auto">
{isLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Creating...
                    </div>
                  ) : (
                    <>
                      <ApperIcon name="Plus" size={16} className="mr-2" />
                      Create Task
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TaskModal;