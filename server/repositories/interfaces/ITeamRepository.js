export class ITeamRepository {
  async findAll() {
    throw new Error("Method 'findAll' must be implemented");
  }

  async findById(id) {
    throw new Error("Method 'findById' must be implemented");
  }

  async findByName(name) {
    throw new Error("Method 'findByName' must be implemented");
  }

  async findAllWithPlayers(gameweekNumber = null) {
    throw new Error("Method 'findAllWithPlayers' must be implemented");
  }

  async findByIdWithFixtures(id) {
    throw new Error("Method 'findByIdWithFixtures' must be implemented");
  }

  async findByIdWithHistory(id) {
    throw new Error("Method 'findByIdWithHistory' must be implemented");
  }

  async create(teamData) {
    throw new Error("Method 'create' must be implemented");
  }

  async update(id, teamData) {
    throw new Error("Method 'update' must be implemented");
  }

  async delete(id) {
    throw new Error("Method 'delete' must be implemented");
  }

  async bulkCreate(teamsData) {
    throw new Error("Method 'bulkCreate' must be implemented");
  }
}
