import GameWeekService from "../services/GameWeekService.js";

class GameWeekController {
  // GET /api/gameweeks - Get all gameweeks
  async getAllGameWeeks(req, res) {
    try {
      const gameweeks = await GameWeekService.getAllGameWeeks();
      res.status(200).json({
        success: true,
        data: gameweeks,
        message: "GameWeeks fetched successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // GET /api/gameweeks/:id - Get gameweek by ID
  async getGameWeekById(req, res) {
    try {
      const { id } = req.params;

      const gameweek = await GameWeekService.getGameWeekById(id);
      res.status(200).json({
        success: true,
        data: gameweek,
        message: "GameWeek fetched successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // GET /api/gameweeks/week/:weekNumber - Get gameweek by week number
  async getGameWeekByNumber(req, res) {
    try {
      const { weekNumber } = req.params;

      const gameweek = await GameWeekService.getGameWeekByNumber(weekNumber);
      res.status(200).json({
        success: true,
        data: gameweek,
        message: "GameWeek fetched successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // GET /api/gameweeks/:id/fixtures - Get gameweek with fixtures
  async getGameWeekWithFixtures(req, res) {
    try {
      const { id } = req.params;

      const gameweek = await GameWeekService.getGameWeekWithFixtures(id);
      res.status(200).json({
        success: true,
        data: gameweek,
        message: "GameWeek with fixtures fetched successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // POST /api/gameweeks - Create new gameweek
  async createGameWeek(req, res) {
    try {
      const { week_number } = req.body;

      const gameweek = await GameWeekService.createGameWeek({ week_number });
      res.status(201).json({
        success: true,
        data: gameweek,
        message: "GameWeek created successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // GET /api/gameweeks/current - Get current gameweek
  async getCurrentGameWeek(req, res) {
    try {
      const gameweek = await GameWeekService.getCurrentGameWeek();
      res.status(200).json({
        success: true,
        data: gameweek,
        message: "Current gameweek fetched successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new GameWeekController();
