import { toast } from 'react-toastify';

class LabelService {
  constructor() {
    this.tableName = 'label_c';
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
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
        ],
        orderBy: [{"fieldName": "Name", "sorttype": "ASC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error("Failed to fetch labels:", response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching labels:", error?.response?.data?.message || error);
      toast.error("Failed to load labels");
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
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);

      if (!response?.data) {
        throw new Error(`Label with id ${id} not found`);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching label ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  }

  async create(labelData) {
    try {
      if (!this.apperClient) this.initializeClient();

      // Only include Updateable fields
      const record = {
        Name: labelData.name || labelData.name_c || "New Label",
        name_c: labelData.name || labelData.name_c || "",
        color_c: labelData.color || labelData.color_c || "blue",
        description_c: labelData.description || labelData.description_c || "",
        created_at_c: new Date().toISOString(),
        updated_at_c: new Date().toISOString()
      };

      const params = {
        records: [record]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error("Failed to create label:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} labels:`, failed);
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
      console.error("Error creating label:", error?.response?.data?.message || error);
      toast.error("Failed to create label");
      return null;
    }
  }

  async update(id, labelData) {
    try {
      if (!this.apperClient) this.initializeClient();

      // Only include Updateable fields
      const record = {
        Name: parseInt(id),
        ...(labelData.name !== undefined && { name_c: labelData.name }),
        ...(labelData.color !== undefined && { color_c: labelData.color }),
        ...(labelData.description !== undefined && { description_c: labelData.description }),
        updated_at_c: new Date().toISOString()
      };

      const params = {
        records: [record]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error("Failed to update label:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} labels:`, failed);
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
      console.error("Error updating label:", error?.response?.data?.message || error);
      toast.error("Failed to update label");
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
        console.error("Failed to delete label:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} labels:`, failed);
          failed.forEach(result => {
            if (result.message) toast.error(result.message);
          });
        }

        return successful.length > 0;
      }

      return true;
    } catch (error) {
      console.error("Error deleting label:", error?.response?.data?.message || error);
      toast.error("Failed to delete label");
      return false;
    }
  }
}

export const labelService = new LabelService();