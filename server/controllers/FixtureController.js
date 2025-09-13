import FixtureService from "../services/FixtureService.js";

class FixtureController {
  // GET /api/fixtures/:gameweekNumber - Takes gameweek number and returns its fixtures
  async getFixturesByGameWeek(req, res) {
    try {
      const { gameweekNumber } = req.params;

      if (!gameweekNumber) {
        return res.status(400).json({
          success: false,
          message: "Gameweek number is required",
        });
      }

      const gameweekNum = parseInt(gameweekNumber);
      if (isNaN(gameweekNum) || gameweekNum < 1) {
        return res.status(400).json({
          success: false,
          message: "Valid gameweek number is required",
        });
      }

      const fixtures = await FixtureService.getFixturesByGameWeek(gameweekNum);
      res.status(200).json({
        success: true,
        data: fixtures,
        message: `Fixtures for gameweek ${gameweekNum} fetched successfully`,
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

      if (!gameweekNumber) {
        return res.status(400).json({
          success: false,
          message: "Gameweek number is required",
        });
      }

      if (!fixtures || !Array.isArray(fixtures)) {
        return res.status(400).json({
          success: false,
          message: "Fixtures array is required",
        });
      }

      const gameweekNum = parseInt(gameweekNumber);
      if (isNaN(gameweekNum) || gameweekNum < 1) {
        return res.status(400).json({
          success: false,
          message: "Valid gameweek number is required",
        });
      }

      // Validate each fixture has required fields
      for (let i = 0; i < fixtures.length; i++) {
        const fixture = fixtures[i];
        if (!fixture.home_team_id || !fixture.away_team_id) {
          return res.status(400).json({
            success: false,
            message: `Fixture ${
              i + 1
            }: home_team_id and away_team_id are required`,
          });
        }
      }

      const createdFixtures = await FixtureService.createFixturesForGameWeek(
        gameweekNum,
        fixtures
      );
      res.status(201).json({
        success: true,
        data: createdFixtures,
        message: `Fixtures for gameweek ${gameweekNum} created successfully`,
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

      if (!gameweekNumber || !fixtureNumber) {
        return res.status(400).json({
          success: false,
          message: "Gameweek number and fixture number are required",
        });
      }

      const gameweekNum = parseInt(gameweekNumber);
      const fixtureNum = parseInt(fixtureNumber);

      if (isNaN(gameweekNum) || gameweekNum < 1) {
        return res.status(400).json({
          success: false,
          message: "Valid gameweek number is required",
        });
      }

      if (isNaN(fixtureNum) || fixtureNum < 1) {
        return res.status(400).json({
          success: false,
          message: "Valid fixture number is required",
        });
      }

      const result = await FixtureService.deleteFixtureFromGameWeek(
        gameweekNum,
        fixtureNum
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

      if (!gameweekNumber || !fixtureNumber) {
        return res.status(400).json({
          success: false,
          message: "Gameweek number and fixture number are required",
        });
      }

      if (home_points === undefined || away_points === undefined) {
        return res.status(400).json({
          success: false,
          message: "Home points and away points are required",
        });
      }

      const gameweekNum = parseInt(gameweekNumber);
      const fixtureNum = parseInt(fixtureNumber);
      const homePoints = parseInt(home_points);
      const awayPoints = parseInt(away_points);

      if (isNaN(gameweekNum) || gameweekNum < 1) {
        return res.status(400).json({
          success: false,
          message: "Valid gameweek number is required",
        });
      }

      if (isNaN(fixtureNum) || fixtureNum < 1) {
        return res.status(400).json({
          success: false,
          message: "Valid fixture number is required",
        });
      }

      if (
        isNaN(homePoints) ||
        isNaN(awayPoints) ||
        homePoints < 0 ||
        awayPoints < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Valid home points and away points are required (non-negative numbers)",
        });
      }

      const updatedFixture = await FixtureService.updateFixtureResult(
        gameweekNum,
        fixtureNum,
        homePoints,
        awayPoints
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
