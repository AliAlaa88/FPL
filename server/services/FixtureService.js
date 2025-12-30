export class FixtureService {
  constructor(fixtureRepository) {
    this.fixtureRepository = fixtureRepository;
  }

  // Get all fixtures
  async getAllFixtures() {
    try {
      const fixtures = await this.fixtureRepository.findAll();
      return fixtures;
    } catch (error) {
      throw new Error(`Error fetching fixtures: ${error.message}`);
    }
  }

  // Get fixture by ID
  async getFixtureById(id) {
    try {
      const fixture = await this.fixtureRepository.findById(id);
      if (!fixture) {
        throw new Error("Fixture not found");
      }
      return fixture;
    } catch (error) {
      throw new Error(`Error fetching fixture: ${error.message}`);
    }
  }

  // Get fixtures by gameweek
  async getFixturesByGameWeek(gameWeekId) {
    try {
      const fixtures = await this.fixtureRepository.findByGameWeek(gameWeekId);
      return fixtures;
    } catch (error) {
      throw new Error(`Error fetching fixtures by gameweek: ${error.message}`);
    }
  }

  // Get fixtures by team
  async getFixturesByTeam(teamId) {
    try {
      const fixtures = await this.fixtureRepository.findByTeam(teamId);
      return fixtures;
    } catch (error) {
      throw new Error(`Error fetching fixtures by team: ${error.message}`);
    }
  }

  // Create fixture
  async createFixture(fixtureData) {
    try {
      // Business logic validation
      const { gameweek_id, home_team_id, away_team_id } = fixtureData;

      if (!gameweek_id || !home_team_id || !away_team_id) {
        throw new Error(
          "Gameweek ID, home team ID, and away team ID are required"
        );
      }

      if (home_team_id === away_team_id) {
        throw new Error("Home team and away team cannot be the same");
      }

      const fixture = await this.fixtureRepository.create(fixtureData);
      return fixture;
    } catch (error) {
      throw new Error(`Error creating fixture: ${error.message}`);
    }
  }

  // Update fixture
  async updateFixture(id, fixtureData) {
    try {
      const updatedFixture = await this.fixtureRepository.update(
        id,
        fixtureData
      );
      if (!updatedFixture) {
        throw new Error("Fixture not found");
      }
      return updatedFixture;
    } catch (error) {
      throw new Error(`Error updating fixture: ${error.message}`);
    }
  }

  // Delete fixture
  async deleteFixture(id) {
    try {
      const deleted = await this.fixtureRepository.delete(id);
      if (!deleted) {
        throw new Error("Fixture not found");
      }
      return { message: "Fixture deleted successfully" };
    } catch (error) {
      throw new Error(`Error deleting fixture: ${error.message}`);
    }
  }

  // Create multiple fixtures
  async createMultipleFixtures(fixturesData) {
    try {
      const fixtures = await this.fixtureRepository.bulkCreate(fixturesData);
      return fixtures;
    } catch (error) {
      throw new Error(`Error creating fixtures: ${error.message}`);
    }
  }
}
