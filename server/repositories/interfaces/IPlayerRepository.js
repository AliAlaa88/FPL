export class IPlayerRepository {
  async findAll() {
    throw new Error("Method 'findAll' must be implemented");
  }

  async findById(entryId) {
    throw new Error("Method 'findById' must be implemented");
  }

  async findByTeam(teamId) {
    throw new Error("Method 'findByTeam' must be implemented");
  }

  async findWithGameWeeks(entryId, gameweekNumber = null) {
    throw new Error("Method 'findWithGameWeeks' must be implemented");
  }

  async create(playerData) {
    throw new Error("Method 'create' must be implemented");
  }

  async update(entryId, playerData) {
    throw new Error("Method 'update' must be implemented");
  }

  async delete(entryId) {
    throw new Error("Method 'delete' must be implemented");
  }

  async bulkCreate(playersData) {
    throw new Error("Method 'bulkCreate' must be implemented");
  }
}
