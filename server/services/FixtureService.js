import { Fixture, Team, GameWeek } from "../models/index.js";
import { Op } from "sequelize";

class FixtureService {
  // Get fixtures by gameweek number
  async getFixturesByGameWeek(gameweekNumber) {
    try {
      // First find the gameweek by number
      const gameweek = await GameWeek.findOne({
        where: { week_number: gameweekNumber },
      });

      if (!gameweek) {
        throw new Error("GameWeek not found");
      }

      const fixtures = await Fixture.findAll({
        where: { gameweek_id: gameweek.id },
        include: [
          {
            association: "homeTeam",
            attributes: ["id", "name"],
          },
          {
            association: "awayTeam",
            attributes: ["id", "name"],
          },
          { association: "gameweek" },
        ],
        order: [["id", "ASC"]],
      });

      return fixtures;
    } catch (error) {
      throw new Error(`Error fetching fixtures by gameweek: ${error.message}`);
    }
  }

  // Create fixtures for a gameweek (max 10 fixtures per gameweek)
  async createFixturesForGameWeek(gameweekNumber, fixturesData) {
    try {
      // Validate max 10 fixtures per gameweek
      if (fixturesData.length > 10) {
        throw new Error("Maximum 10 fixtures allowed per gameweek");
      }

      // Find or create gameweek
      let gameweek = await GameWeek.findOne({
        where: { week_number: gameweekNumber },
      });

      if (!gameweek) {
        gameweek = await GameWeek.create({ week_number: gameweekNumber });
      }

      // Check how many fixtures already exist for this gameweek
      const existingFixturesCount = await Fixture.count({
        where: { gameweek_id: gameweek.id },
      });

      if (existingFixturesCount + fixturesData.length > 10) {
        throw new Error(
          `Cannot create fixtures. Would exceed maximum of 10 fixtures per gameweek. Currently has ${existingFixturesCount} fixtures.`
        );
      }

      // Prepare fixtures data
      const fixturesToCreate = fixturesData.map((fixture) => ({
        gameweek_id: gameweek.id,
        home_team_id: fixture.home_team_id,
        away_team_id: fixture.away_team_id,
        home_points: fixture.home_points || null,
        away_points: fixture.away_points || null,
      }));

      // Validate each fixture
      for (const fixture of fixturesToCreate) {
        // Validate that teams are different
        if (fixture.home_team_id === fixture.away_team_id) {
          throw new Error("Home team and away team cannot be the same");
        }

        // Validate that teams exist
        const homeTeam = await Team.findByPk(fixture.home_team_id);
        const awayTeam = await Team.findByPk(fixture.away_team_id);
        if (!homeTeam || !awayTeam) {
          throw new Error(
            `One or both teams not found: home_team_id(${fixture.home_team_id}), away_team_id(${fixture.away_team_id})`
          );
        }
      }

      // Create fixtures
      const createdFixtures = await Fixture.bulkCreate(fixturesToCreate);

      // Return fixtures with team details
      return await this.getFixturesByGameWeek(gameweekNumber);
    } catch (error) {
      throw new Error(`Error creating fixtures: ${error.message}`);
    }
  }

  // Delete fixture by gameweek number and fixture position in gameweek
  async deleteFixtureFromGameWeek(gameweekNumber, fixtureNumber) {
    try {
      // Find the gameweek
      const gameweek = await GameWeek.findOne({
        where: { week_number: gameweekNumber },
      });

      if (!gameweek) {
        throw new Error("GameWeek not found");
      }

      // Get all fixtures for this gameweek ordered by id
      const fixtures = await Fixture.findAll({
        where: { gameweek_id: gameweek.id },
        order: [["id", "ASC"]],
      });

      // Validate fixture number (1-based indexing)
      if (fixtureNumber < 1 || fixtureNumber > fixtures.length) {
        throw new Error(
          `Invalid fixture number. Must be between 1 and ${fixtures.length}`
        );
      }

      // Get the specific fixture (convert to 0-based indexing)
      const fixtureToDelete = fixtures[fixtureNumber - 1];

      await fixtureToDelete.destroy();

      return {
        message: `Fixture ${fixtureNumber} from gameweek ${gameweekNumber} deleted successfully`,
      };
    } catch (error) {
      throw new Error(`Error deleting fixture: ${error.message}`);
    }
  }

  // Get all fixtures (for admin purposes)
  async getAllFixtures() {
    try {
      const fixtures = await Fixture.findAll({
        include: [
          {
            association: "homeTeam",
            attributes: ["id", "name"],
          },
          {
            association: "awayTeam",
            attributes: ["id", "name"],
          },
          { association: "gameweek" },
        ],
        order: [
          [{ model: GameWeek, as: "gameweek" }, "week_number", "ASC"],
          ["id", "ASC"],
        ],
      });
      return fixtures;
    } catch (error) {
      throw new Error(`Error fetching fixtures: ${error.message}`);
    }
  }

  // Update fixture result
  async updateFixtureResult(
    gameweekNumber,
    fixtureNumber,
    homePoints,
    awayPoints
  ) {
    try {
      // Find the gameweek
      const gameweek = await GameWeek.findOne({
        where: { week_number: gameweekNumber },
      });

      if (!gameweek) {
        throw new Error("GameWeek not found");
      }

      // Get all fixtures for this gameweek ordered by id
      const fixtures = await Fixture.findAll({
        where: { gameweek_id: gameweek.id },
        order: [["id", "ASC"]],
      });

      // Validate fixture number
      if (fixtureNumber < 1 || fixtureNumber > fixtures.length) {
        throw new Error(
          `Invalid fixture number. Must be between 1 and ${fixtures.length}`
        );
      }

      // Get the specific fixture
      const fixture = fixtures[fixtureNumber - 1];

      // Update fixture result
      const updatedFixture = await fixture.update({
        home_points: homePoints,
        away_points: awayPoints,
      });

      // Return updated fixture with team details
      return await Fixture.findByPk(updatedFixture.id, {
        include: [
          { association: "homeTeam" },
          { association: "awayTeam" },
          { association: "gameweek" },
        ],
      });
    } catch (error) {
      throw new Error(`Error updating fixture result: ${error.message}`);
    }
  }
}

export default new FixtureService();
