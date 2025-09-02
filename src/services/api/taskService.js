import { toast } from 'react-toastify';

class TaskService {
  constructor() {
    this.tableName = 'task_c';
    this.initializeClient();
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async getAll(boardId = null) {
    try {
      if (!this.apperClient) this.initializeClient();

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "column_c"}},
          {"field": {"Name": "assignee_c"}},
          {"field": {"Name": "labels_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
        ],
        orderBy: [{"fieldName": "Name", "sorttype": "ASC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      // Add board filtering if boardId provided
      if (boardId) {
        // Simple approach: filter by record ID ranges or implement board relationship
        const tasksPerBoard = 6;
        const startOffset = (boardId - 1) * tasksPerBoard;
        params.pagingInfo = {"limit": tasksPerBoard, "offset": startOffset};
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error("Failed to fetch tasks:", response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error);
      toast.error("Failed to load tasks");
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "column_c"}},
          {"field": {"Name": "assignee_c"}},
          {"field": {"Name": "labels_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);

      if (!response?.data) {
        throw new Error(`Task with id ${id} not found`);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(taskData) {
    try {
      if (!this.apperClient) this.initializeClient();

      // Only include Updateable fields
      const record = {
        Name: taskData.title || taskData.Name || "New Task",
        title_c: taskData.title || taskData.title_c || "",
        description_c: taskData.description || taskData.description_c || "",
        priority_c: taskData.priority || taskData.priority_c || "medium",
        column_c: taskData.column || taskData.column_c || "backlog",
        assignee_c: taskData.assignee || taskData.assignee_c || "Developer",
        labels_c: Array.isArray(taskData.labels) ? taskData.labels.join(",") : (taskData.labels_c || ""),
        created_at_c: new Date().toISOString(),
        updated_at_c: new Date().toISOString()
      };

      const params = {
        records: [record]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error("Failed to create task:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} tasks:`, failed);
          failed.forEach(result => {
            if (result.message) toast.error(result.message);
          });
        }

        if (successful.length > 0) {
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error);
      toast.error("Failed to create task");
      return null;
    }
  }

  async update(id, taskData) {
    try {
      if (!this.apperClient) this.initializeClient();

      // Only include Updateable fields
      const record = {
        Name: parseInt(id),
        ...(taskData.title !== undefined && { title_c: taskData.title }),
        ...(taskData.description !== undefined && { description_c: taskData.description }),
        ...(taskData.priority !== undefined && { priority_c: taskData.priority }),
        ...(taskData.column !== undefined && { column_c: taskData.column }),
        ...(taskData.assignee !== undefined && { assignee_c: taskData.assignee }),
        ...(taskData.labels !== undefined && { 
          labels_c: Array.isArray(taskData.labels) ? taskData.labels.join(",") : taskData.labels 
        }),
        updated_at_c: new Date().toISOString()
      };

      const params = {
        records: [record]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error("Failed to update task:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} tasks:`, failed);
          failed.forEach(result => {
            if (result.message) toast.error(result.message);
          });
        }

        if (successful.length > 0) {
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error);
      toast.error("Failed to update task");
      return null;
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient();

      const params = { 
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error("Failed to delete task:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} tasks:`, failed);
          failed.forEach(result => {
            if (result.message) toast.error(result.message);
          });
        }

        return successful.length > 0;
      }

      return true;
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error);
      toast.error("Failed to delete task");
      return false;
    }
  }

  async getByColumn(columnId) {
    try {
      const allTasks = await this.getAll();
      return allTasks.filter(task => task.column_c === columnId);
    } catch (error) {
      console.error("Error filtering tasks by column:", error);
      return [];
    }
  }

  async getByLabels(labelNames) {
    try {
      const allTasks = await this.getAll();
      const lowerLabels = labelNames.map(name => name.toLowerCase());
      return allTasks.filter(task => {
        if (!task.labels_c) return false;
        const taskLabels = task.labels_c.toLowerCase().split(',');
        return taskLabels.some(label => lowerLabels.includes(label.trim()));
      });
    } catch (error) {
      console.error("Error filtering tasks by labels:", error);
      return [];
    }
  }
}

export const taskService = new TaskService();