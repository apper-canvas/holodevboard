import { toast } from 'react-toastify';

class ColumnService {
  constructor() {
    this.tableName = 'column_c';
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
          {"field": {"Name": "position_c"}}
        ],
        orderBy: [{"fieldName": "position_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      };

      // Add board filtering if boardId provided
      if (boardId) {
        // Simple approach: show first 5 columns per board or implement board relationship
        const columnsPerBoard = 5;
        const startOffset = (boardId - 1) * columnsPerBoard;
        params.pagingInfo = {"limit": columnsPerBoard, "offset": startOffset};
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error("Failed to fetch columns:", response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching columns:", error?.response?.data?.message || error);
      toast.error("Failed to load columns");
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
          {"field": {"Name": "position_c"}}
        ]
      };

      // For columns, id might be string, so we need to handle both cases
      let searchId = id;
      if (typeof id === 'string' && isNaN(parseInt(id))) {
        // Find by title_c field instead
        const allColumns = await this.getAll();
        const column = allColumns.find(col => col.title_c === id);
        if (!column) {
          throw new Error(`Column with id ${id} not found`);
        }
        return column;
      }

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(searchId), params);

      if (!response?.data) {
        throw new Error(`Column with id ${id} not found`);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching column ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(columnData) {
    try {
      if (!this.apperClient) this.initializeClient();

      // Only include Updateable fields
      const record = {
        Name: columnData.title || columnData.title_c || "New Column",
        title_c: columnData.title || columnData.title_c || "",
        position_c: columnData.position || columnData.position_c || 1
      };

      const params = {
        records: [record]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error("Failed to create column:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} columns:`, failed);
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
      console.error("Error creating column:", error?.response?.data?.message || error);
      toast.error("Failed to create column");
      return null;
    }
  }

  async update(id, columnData) {
    try {
      if (!this.apperClient) this.initializeClient();

      // Handle string IDs by finding the actual record ID
      let recordId = id;
      if (typeof id === 'string' && isNaN(parseInt(id))) {
        const allColumns = await this.getAll();
        const column = allColumns.find(col => col.title_c === id);
        if (!column) {
          throw new Error(`Column with id ${id} not found`);
        }
        recordId = column.Name;
      }

      // Only include Updateable fields
      const record = {
        Name: parseInt(recordId),
        ...(columnData.title !== undefined && { title_c: columnData.title }),
        ...(columnData.position !== undefined && { position_c: columnData.position })
      };

      const params = {
        records: [record]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error("Failed to update column:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} columns:`, failed);
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
      console.error("Error updating column:", error?.response?.data?.message || error);
      toast.error("Failed to update column");
      return null;
    }
  }

  async updatePositions(columnPositions) {
    try {
      if (!this.apperClient) this.initializeClient();

      const updatePromises = columnPositions.map(async ({ id, position }) => {
        return this.update(id, { position });
      });

      const results = await Promise.all(updatePromises);
      return results.filter(result => result !== null);
    } catch (error) {
      console.error("Error updating column positions:", error);
      toast.error("Failed to update column positions");
      return [];
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient();

      // Handle string IDs by finding the actual record ID
      let recordId = id;
      if (typeof id === 'string' && isNaN(parseInt(id))) {
        const allColumns = await this.getAll();
        const column = allColumns.find(col => col.title_c === id);
        if (!column) {
          throw new Error(`Column with id ${id} not found`);
        }
        recordId = column.Name;
      }

      const params = { 
        RecordIds: [parseInt(recordId)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error("Failed to delete column:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} columns:`, failed);
          failed.forEach(result => {
            if (result.message) toast.error(result.message);
          });
        }

        return successful.length > 0;
      }

      return true;
    } catch (error) {
      console.error("Error deleting column:", error?.response?.data?.message || error);
      toast.error("Failed to delete column");
      return false;
    }
  }
}

export const columnService = new ColumnService();