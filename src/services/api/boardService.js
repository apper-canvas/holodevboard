import boardsData from '@/services/mockData/boards.json';

class BoardService {
  constructor() {
    this.boards = [...boardsData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }

  async getAll() {
    await this.delay();
    return [...this.boards];
  }

  async getById(id) {
    await this.delay();
    const board = this.boards.find(b => b.Id === parseInt(id));
    if (!board) throw new Error('Board not found');
    return { ...board };
  }

  async create(boardData) {
    await this.delay();
    const newBoard = {
      Id: Math.max(...this.boards.map(b => b.Id), 0) + 1,
      name: boardData.name,
      description: boardData.description || '',
      color: boardData.color || '#5E72E4',
      createdAt: new Date().toISOString()
    };
    this.boards.push(newBoard);
    return { ...newBoard };
  }

  async update(id, boardData) {
    await this.delay();
    const index = this.boards.findIndex(b => b.Id === parseInt(id));
    if (index === -1) throw new Error('Board not found');
    
    const updatedBoard = {
      ...this.boards[index],
      ...boardData,
      Id: parseInt(id)
    };
    this.boards[index] = updatedBoard;
    return { ...updatedBoard };
  }

  async delete(id) {
    await this.delay();
    const index = this.boards.findIndex(b => b.Id === parseInt(id));
    if (index === -1) throw new Error('Board not found');
    
    const deletedBoard = this.boards.splice(index, 1)[0];
    return { ...deletedBoard };
  }
}

export const boardService = new BoardService();