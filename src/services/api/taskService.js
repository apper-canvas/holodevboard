import tasksData from "@/services/mockData/tasks.json";

class TaskService {
  constructor() {
    this.tasks = [...tasksData];
  }

  async getAll() {
    await this.delay();
    return [...this.tasks];
  }

  async getById(id) {
    await this.delay();
    const task = this.tasks.find(task => task.Id === parseInt(id));
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }
    return { ...task };
  }

  async create(taskData) {
    await this.delay();
    const newId = Math.max(...this.tasks.map(t => t.Id), 0) + 1;
    const newTask = {
      Id: newId,
      ...taskData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.tasks.push(newTask);
    return { ...newTask };
  }

  async update(id, taskData) {
    await this.delay();
    const index = this.tasks.findIndex(task => task.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Task with id ${id} not found`);
    }
    
    this.tasks[index] = {
      ...this.tasks[index],
      ...taskData,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.tasks[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.tasks.findIndex(task => task.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Task with id ${id} not found`);
    }
    
    const deletedTask = this.tasks.splice(index, 1)[0];
    return { ...deletedTask };
  }

  async getByColumn(columnId) {
    await this.delay();
    return this.tasks.filter(task => task.column === columnId);
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }
}

export const taskService = new TaskService();