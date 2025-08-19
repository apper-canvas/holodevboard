import labelsData from "@/services/mockData/labels.json";

class LabelService {
  constructor() {
    this.labels = [...labelsData];
  }

  async getAll() {
    await this.delay();
    return [...this.labels];
  }

  async getById(id) {
    await this.delay();
    const label = this.labels.find(label => label.Id === parseInt(id));
    if (!label) {
      throw new Error(`Label with id ${id} not found`);
    }
    return { ...label };
  }

  async create(labelData) {
    await this.delay();
    const newId = Math.max(...this.labels.map(l => l.Id), 0) + 1;
    const newLabel = {
      Id: newId,
      ...labelData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.labels.push(newLabel);
    return { ...newLabel };
  }

  async update(id, labelData) {
    await this.delay();
    const index = this.labels.findIndex(label => label.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Label with id ${id} not found`);
    }
    
    this.labels[index] = {
      ...this.labels[index],
      ...labelData,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.labels[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.labels.findIndex(label => label.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Label with id ${id} not found`);
    }
    
    const deletedLabel = this.labels.splice(index, 1)[0];
    return { ...deletedLabel };
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }
}

export const labelService = new LabelService();