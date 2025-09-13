import { GameWeek } from "../models/index.js";

class GameWeekService {
  // Get all gameweeks
  async getAllGameWeeks() {
    try {
      const gameweeks = await GameWeek.findAll({
        order: [["week_number", "ASC"]],
      });
      return gameweeks;
    } catch (error) {
      throw new Error(`Error fetching gameweeks: ${error.message}`);
    }
  }

  // Get gameweek by ID
  async getGameWeekById(id) {
    try {
      const gameweek = await GameWeek.findByPk(id);
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
      const gameweek = await GameWeek.findOne({
        where: { week_number: weekNumber },
      });
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

      // Check if gameweek already exists
      const existingGameWeek = await GameWeek.findOne({
        where: { week_number },
      });
      if (existingGameWeek) {
        throw new Error("GameWeek already exists");
      }

      const gameweek = await GameWeek.create({ week_number });
      return gameweek;
    } catch (error) {
      throw new Error(`Error creating gameweek: ${error.message}`);
    }
  }

  // Update gameweek
  async updateGameWeek(id, gameweekData) {
    try {
      const gameweek = await GameWeek.findByPk(id);
      if (!gameweek) {
        throw new Error("GameWeek not found");
      }

      const updatedGameWeek = await gameweek.update(gameweekData);
      return updatedGameWeek;
    } catch (error) {
      throw new Error(`Error updating gameweek: ${error.message}`);
    }
  }

  // Delete gameweek
  async deleteGameWeek(id) {
    try {
      const gameweek = await GameWeek.findByPk(id);
      if (!gameweek) {
        throw new Error("GameWeek not found");
      }

      await gameweek.destroy();
      return { message: "GameWeek deleted successfully" };
    } catch (error) {
      throw new Error(`Error deleting gameweek: ${error.message}`);
    }
  }

  // Get gameweek with all fixtures
  async getGameWeekWithFixtures(id) {
    try {
      const gameweek = await GameWeek.findByPk(id, {
        include: [
          {
            association: "fixtures",
            include: [{ association: "homeTeam" }, { association: "awayTeam" }],
          },
        ],
      });

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
      const currentGameweek = await GameWeek.findOne({
        order: [["week_number", "DESC"]],
      });
      return currentGameweek;
    } catch (error) {
      throw new Error(`Error fetching current gameweek: ${error.message}`);
    }
  }

  // Create multiple gameweeks
  async createMultipleGameWeeks(gameweeksData) {
    try {
      const gameweeks = await GameWeek.bulkCreate(gameweeksData, {
        validate: true,
        ignoreDuplicates: true,
      });
      return gameweeks;
    } catch (error) {
      throw new Error(`Error creating gameweeks: ${error.message}`);
    }
  }

  // Get gameweeks in range
  async getGameWeeksInRange(startWeek, endWeek) {
    try {
      const gameweeks = await GameWeek.findAll({
        where: {
          week_number: {
            [Op.between]: [startWeek, endWeek],
          },
        },
        order: [["week_number", "ASC"]],
      });
      return gameweeks;
    } catch (error) {
      throw new Error(`Error fetching gameweeks in range: ${error.message}`);
    }
  }
}

export default new GameWeekService();
