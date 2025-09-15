export class GameWeekController {
  constructor(gameWeekService) {
    this.gameWeekService = gameWeekService;
  }

  // Get all gameweeks
  getAllGameWeeks = async (req, res) => {
    try {
      const gameweeks = await this.gameWeekService.getAllGameWeeks();
      res.json(gameweeks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Get gameweek by ID
  getGameWeekById = async (req, res) => {
    try {
      const { id } = req.params;
      const gameweek = await this.gameWeekService.getGameWeekById(id);
      res.json(gameweek);
    } catch (error) {
      if (error.message.includes("not found")) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  };

  // Get gameweek by week number
  getGameWeekByNumber = async (req, res) => {
    try {
      const { weekNumber } = req.params;
      const gameweek = await this.gameWeekService.getGameWeekByNumber(
        parseInt(weekNumber)
      );
      res.json(gameweek);
    } catch (error) {
      if (error.message.includes("not found")) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  };

  // Create gameweek
  createGameWeek = async (req, res) => {
    try {
      const gameweek = await this.gameWeekService.createGameWeek(req.body);
      res.status(201).json(gameweek);
    } catch (error) {
      if (
        error.message.includes("already exists") ||
        error.message.includes("required")
      ) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  };

  // Update gameweek
  updateGameWeek = async (req, res) => {
    try {
      const { id } = req.params;
      const gameweek = await this.gameWeekService.updateGameWeek(id, req.body);
      res.json(gameweek);
    } catch (error) {
      if (error.message.includes("not found")) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  };

  // Delete gameweek
  deleteGameWeek = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.gameWeekService.deleteGameWeek(id);
      res.json(result);
    } catch (error) {
      if (error.message.includes("not found")) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  };

  // Get gameweek with fixtures
  getGameWeekWithFixtures = async (req, res) => {
    try {
      const { id } = req.params;
      const gameweek = await this.gameWeekService.getGameWeekWithFixtures(id);
      res.json(gameweek);
    } catch (error) {
      if (error.message.includes("not found")) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  };

  // Get current gameweek
  getCurrentGameWeek = async (req, res) => {
    try {
      const gameweek = await this.gameWeekService.getCurrentGameWeek();
      res.json(gameweek);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
