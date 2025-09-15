export class IGameWeekRepository {
  async findAll() {
    throw new Error("Method 'findAll' must be implemented");
  }

  async findById(id) {
    throw new Error("Method 'findById' must be implemented");
  }

  async findByWeekNumber(weekNumber) {
    throw new Error("Method 'findByWeekNumber' must be implemented");
  }

  async findWithFixtures(id) {
    throw new Error("Method 'findWithFixtures' must be implemented");
  }

  async create(gameWeekData) {
    throw new Error("Method 'create' must be implemented");
  }

  async update(id, gameWeekData) {
    throw new Error("Method 'update' must be implemented");
  }

  async delete(id) {
    throw new Error("Method 'delete' must be implemented");
  }

  async getCurrentGameWeek() {
    throw new Error("Method 'getCurrentGameWeek' must be implemented");
  }
}
