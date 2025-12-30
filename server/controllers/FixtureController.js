export class FixtureController {
  constructor(fixtureService) {
    this.fixtureService = fixtureService;
  }

  // Get all fixtures
  getAllFixtures = async (req, res) => {
    try {
      const fixtures = await this.fixtureService.getAllFixtures();
      res.json(fixtures);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Get fixture by ID
  getFixtureById = async (req, res) => {
    try {
      const { id } = req.params;
      const fixture = await this.fixtureService.getFixtureById(id);
      res.json(fixture);
    } catch (error) {
      if (error.message.includes("not found")) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  };

  // Get fixtures by gameweek
  getFixturesByGameWeek = async (req, res) => {
    try {
      const { gameWeekId } = req.params;
      const fixtures = await this.fixtureService.getFixturesByGameWeek(
        parseInt(gameWeekId)
      );
      res.json(fixtures);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Get fixtures by team
  getFixturesByTeam = async (req, res) => {
    try {
      const { teamId } = req.params;
      const fixtures = await this.fixtureService.getFixturesByTeam(
        parseInt(teamId)
      );
      res.json(fixtures);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Create fixture
  createFixture = async (req, res) => {
    try {
      const fixture = await this.fixtureService.createFixture(req.body);
      res.status(201).json(fixture);
    } catch (error) {
      if (
        error.message.includes("required") ||
        error.message.includes("cannot be the same")
      ) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  };

  // Update fixture
  updateFixture = async (req, res) => {
    try {
      const { id } = req.params;
      const fixture = await this.fixtureService.updateFixture(id, req.body);
      res.json(fixture);
    } catch (error) {
      if (error.message.includes("not found")) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  };

  // Delete fixture
  deleteFixture = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.fixtureService.deleteFixture(id);
      res.json(result);
    } catch (error) {
      if (error.message.includes("not found")) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  };

  // Create multiple fixtures
  createMultipleFixtures = async (req, res) => {
    try {
      const fixtures = await this.fixtureService.createMultipleFixtures(
        req.body
      );
      res.status(201).json(fixtures);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
