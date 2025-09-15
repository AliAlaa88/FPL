export class IFixtureRepository {
  async findAll() {
    throw new Error("Method 'findAll' must be implemented");
  }

  async findById(id) {
    throw new Error("Method 'findById' must be implemented");
  }

  async findByGameWeek(gameWeekId) {
    throw new Error("Method 'findByGameWeek' must be implemented");
  }

  async findByTeam(teamId) {
    throw new Error("Method 'findByTeam' must be implemented");
  }

  async create(fixtureData) {
    throw new Error("Method 'create' must be implemented");
  }

  async update(id, fixtureData) {
    throw new Error("Method 'update' must be implemented");
  }

  async delete(id) {
    throw new Error("Method 'delete' must be implemented");
  }

  async bulkCreate(fixturesData) {
    throw new Error("Method 'bulkCreate' must be implemented");
  }
}
