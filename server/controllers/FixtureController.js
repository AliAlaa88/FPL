import FixtureService from "../services/FixtureService.js";

class FixtureController {
  // GET /api/fixtures/:gameweekNumber - Takes gameweek number and returns its fixtures
  async getFixturesByGameWeek(req, res) {
    try {
      const { gameweekNumber } = req.params;

      const fixtures = await FixtureService.getFixturesByGameWeek(
        gameweekNumber
      );
      res.status(200).json({
        success: true,
        data: fixtures,
        message: `Fixtures for gameweek ${gameweekNumber} fetched successfully`,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // POST /api/fixtures/:gameweekNumber - Takes gameweek number with max 10 fixtures per gameweek
  async createFixtures(req, res) {
    try {
      const { gameweekNumber } = req.params;
      const { fixtures } = req.body;

      const createdFixtures = await FixtureService.createFixturesForGameWeek(
        gameweekNumber,
        fixtures
      );
      res.status(201).json({
        success: true,
        data: createdFixtures,
        message: `Fixtures for gameweek ${gameweekNumber} created successfully`,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // DELETE /api/fixtures/:gameweekNumber/:fixtureNumber - Takes gameweek number and fixture number
  async deleteFixture(req, res) {
    try {
      const { gameweekNumber, fixtureNumber } = req.params;

      const result = await FixtureService.deleteFixtureFromGameWeek(
        gameweekNumber,
        fixtureNumber
      );
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // GET /api/fixtures - Get all fixtures (admin route)
  async getAllFixtures(req, res) {
    try {
      const fixtures = await FixtureService.getAllFixtures();
      res.status(200).json({
        success: true,
        data: fixtures,
        message: "All fixtures fetched successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // PUT /api/fixtures/:gameweekNumber/:fixtureNumber/result - Update fixture result
  async updateFixtureResult(req, res) {
    try {
      const { gameweekNumber, fixtureNumber } = req.params;
      const { home_points, away_points } = req.body;

      const updatedFixture = await FixtureService.updateFixtureResult(
        gameweekNumber,
        fixtureNumber,
        home_points,
        away_points
      );
      res.status(200).json({
        success: true,
        data: updatedFixture,
        message: "Fixture result updated successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new FixtureController();
