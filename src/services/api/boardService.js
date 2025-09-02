import { toast } from 'react-toastify';

class BoardService {
  constructor() {
    this.tableName = 'board_c';
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

  async getAll() {
    try {
      if (!this.apperClient) this.initializeClient();

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "created_at_c"}}
        ],
        orderBy: [{"fieldName": "Name", "sorttype": "ASC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error("Failed to fetch boards:", response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching boards:", error?.response?.data?.message || error);
      toast.error("Failed to load boards");
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "created_at_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);

      if (!response?.data) {
        throw new Error('Board not found');
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching board ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(boardData) {
    try {
      if (!this.apperClient) this.initializeClient();

      // Only include Updateable fields
      const record = {
        Name: boardData.name || boardData.name_c || "New Board",
        name_c: boardData.name || boardData.name_c || "",
        description_c: boardData.description || boardData.description_c || "",
        color_c: boardData.color || boardData.color_c || "#5E72E4",
        created_at_c: new Date().toISOString()
      };

      const params = {
        records: [record]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error("Failed to create board:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} boards:`, failed);
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
      console.error("Error creating board:", error?.response?.data?.message || error);
      toast.error("Failed to create board");
      return null;
    }
  }

  async update(id, boardData) {
    try {
      if (!this.apperClient) this.initializeClient();

      // Only include Updateable fields
      const record = {
        Name: parseInt(id),
        ...(boardData.name !== undefined && { name_c: boardData.name }),
        ...(boardData.description !== undefined && { description_c: boardData.description }),
        ...(boardData.color !== undefined && { color_c: boardData.color })
      };

      const params = {
        records: [record]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error("Failed to update board:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} boards:`, failed);
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
      console.error("Error updating board:", error?.response?.data?.message || error);
      toast.error("Failed to update board");
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
        console.error("Failed to delete board:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} boards:`, failed);
          failed.forEach(result => {
            if (result.message) toast.error(result.message);
          });
        }

        return successful.length > 0;
      }

      return true;
    } catch (error) {
      console.error("Error deleting board:", error?.response?.data?.message || error);
      toast.error("Failed to delete board");
      return false;
    }
  }
}

export const boardService = new BoardService();