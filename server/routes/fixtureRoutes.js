import express from "express";
import FixtureController from "../controllers/FixtureController.js";
import { validate, fixtureSchemas } from "../middleware/index.js";

const router = express.Router();

// GET /api/fixtures - Get all fixtures (admin route) - MUST come before parameterized routes
router.get("/", FixtureController.getAllFixtures);

// GET /api/fixtures/:gameweekNumber - Get fixtures by gameweek
router.get(
  "/:gameweekNumber",
  validate(fixtureSchemas.getFixturesByGameWeek),
  FixtureController.getFixturesByGameWeek
);

// POST /api/fixtures/:gameweekNumber - Create fixtures for gameweek
router.post(
  "/:gameweekNumber",
  validate(fixtureSchemas.createFixtures),
  FixtureController.createFixtures
);

// PUT /api/fixtures/:gameweekNumber/:fixtureNumber/result - Update fixture result
router.put(
  "/:gameweekNumber/:fixtureNumber/result",
  validate(fixtureSchemas.updateFixtureResult),
  FixtureController.updateFixtureResult
);

// DELETE /api/fixtures/:gameweekNumber/:fixtureNumber - Delete a fixture
router.delete(
  "/:gameweekNumber/:fixtureNumber",
  validate(fixtureSchemas.deleteFixture),
  FixtureController.deleteFixture
);

export default router;
