import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import TextArea from "@/components/atoms/TextArea";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";

const TaskModal = ({ isOpen, onClose, onSubmit, defaultColumn, columns }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    column: defaultColumn || (columns[0]?.id || "backlog"),
    assignee: "Developer"
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const taskData = {
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSubmit(taskData);
    
    // Reset form
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      column: defaultColumn || (columns[0]?.id || "backlog"),
      assignee: "Developer"
    });
    setErrors({});
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
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
          className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 dark:bg-gray-800"
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

            <div className="grid grid-cols-2 gap-4">
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
                    <option key={column.id} value={column.id}>
                      {column.title}
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>

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

            <div className="flex items-center justify-end space-x-3 pt-4">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                <ApperIcon name="Plus" size={16} className="mr-2" />
                Create Task
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TaskModal;