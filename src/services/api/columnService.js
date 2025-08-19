import columnsData from "@/services/mockData/columns.json";

class ColumnService {
  constructor() {
    this.columns = [...columnsData];
  }

async getAll(boardId = null) {
    await this.delay();
    let filteredColumns = [...this.columns];
    
    if (boardId) {
      // Filter columns by boardId, or show columns 1-3 for board 1, 4-6 for board 2, etc.
      const columnsPerBoard = 3;
      const startIndex = (boardId - 1) * columnsPerBoard;
      const endIndex = startIndex + columnsPerBoard;
      filteredColumns = filteredColumns.slice(startIndex, endIndex);
    }
    
    return filteredColumns.sort((a, b) => a.position - b.position);
  }

  async getById(id) {
    await this.delay();
    const column = this.columns.find(col => col.id === id);
    if (!column) {
      throw new Error(`Column with id ${id} not found`);
    }
    return { ...column };
  }

  async create(columnData) {
    await this.delay();
    const newColumn = {
      id: columnData.id || `column-${Date.now()}`,
      title: columnData.title,
      position: columnData.position || this.columns.length + 1
    };
    this.columns.push(newColumn);
    return { ...newColumn };
  }

  async update(id, columnData) {
    await this.delay();
    const index = this.columns.findIndex(col => col.id === id);
    if (index === -1) {
      throw new Error(`Column with id ${id} not found`);
    }
    
    this.columns[index] = {
      ...this.columns[index],
      ...columnData,
      id: id
    };
    
    return { ...this.columns[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.columns.findIndex(col => col.id === id);
    if (index === -1) {
      throw new Error(`Column with id ${id} not found`);
    }
    
    const deletedColumn = this.columns.splice(index, 1)[0];
    return { ...deletedColumn };
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }
}

export const columnService = new ColumnService();