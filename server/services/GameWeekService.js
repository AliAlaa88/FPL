export class GameWeekService {
  constructor(gameWeekRepository) {
    this.gameWeekRepository = gameWeekRepository;
  }

  // Get all gameweeks
  async getAllGameWeeks() {
    try {
      const gameweeks = await this.gameWeekRepository.findAll();
      return gameweeks;
    } catch (error) {
      throw new Error(`Error fetching gameweeks: ${error.message}`);
    }
  }

  // Get gameweek by ID
  async getGameWeekById(id) {
    try {
      const gameweek = await this.gameWeekRepository.findById(id);
      if (!gameweek) {
        throw new Error("GameWeek not found");
      }
      return gameweek;
    } catch (error) {
      throw new Error(`Error fetching gameweek: ${error.message}`);
    }
  }

  // Get gameweek by week number
  async getGameWeekByNumber(weekNumber) {
    try {
      const gameweek = await this.gameWeekRepository.findByWeekNumber(
        weekNumber
      );
      if (!gameweek) {
        throw new Error("GameWeek not found");
      }
      return gameweek;
    } catch (error) {
      throw new Error(`Error fetching gameweek: ${error.message}`);
    }
  }

  // Create a new gameweek
  async createGameWeek(gameweekData) {
    try {
      const { week_number } = gameweekData;

      // Business logic validation
      if (!week_number) {
        throw new Error("Week number is required");
      }

      // Check if gameweek already exists
      const existingGameWeek = await this.gameWeekRepository.findByWeekNumber(
        week_number
      );
      if (existingGameWeek) {
        throw new Error("GameWeek already exists");
      }

      const gameweek = await this.gameWeekRepository.create({ week_number });
      return gameweek;
    } catch (error) {
      throw new Error(`Error creating gameweek: ${error.message}`);
    }
  }

  // Update gameweek
  async updateGameWeek(id, gameweekData) {
    try {
      const updatedGameWeek = await this.gameWeekRepository.update(
        id,
        gameweekData
      );
      if (!updatedGameWeek) {
        throw new Error("GameWeek not found");
      }
      return updatedGameWeek;
    } catch (error) {
      throw new Error(`Error updating gameweek: ${error.message}`);
    }
  }

  // Delete gameweek
  async deleteGameWeek(id) {
    try {
      const deleted = await this.gameWeekRepository.delete(id);
      if (!deleted) {
        throw new Error("GameWeek not found");
      }
      return { message: "GameWeek deleted successfully" };
    } catch (error) {
      throw new Error(`Error deleting gameweek: ${error.message}`);
    }
  }

  // Get gameweek with all fixtures
  async getGameWeekWithFixtures(id) {
    try {
      const gameweek = await this.gameWeekRepository.findWithFixtures(id);
      if (!gameweek) {
        throw new Error("GameWeek not found");
      }
      return gameweek;
    } catch (error) {
      throw new Error(
        `Error fetching gameweek with fixtures: ${error.message}`
      );
    }
  }

  // Get current gameweek (latest one)
  async getCurrentGameWeek() {
    try {
      const currentGameweek =
        await this.gameWeekRepository.getCurrentGameWeek();
      return currentGameweek;
    } catch (error) {
      throw new Error(`Error fetching current gameweek: ${error.message}`);
    }
  }
}

export default new GameWeekService();
