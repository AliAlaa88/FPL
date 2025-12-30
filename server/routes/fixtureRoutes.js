import express from "express";
import DIContainer from "../container/DIContainer.js";
import { validate, fixtureSchemas } from "../middleware/index.js";

const router = express.Router();
const fixtureController = DIContainer.get("FixtureController");

// GET /api/fixtures - Get all fixtures
router.get("/", fixtureController.getAllFixtures);

// GET /api/fixtures/gameweek/:gameWeekId - Get fixtures by gameweek
router.get("/gameweek/:gameWeekId", fixtureController.getFixturesByGameWeek);

// GET /api/fixtures/team/:teamId - Get fixtures by team
router.get("/team/:teamId", fixtureController.getFixturesByTeam);

// POST /api/fixtures - Create fixture
router.post("/", fixtureController.createFixture);

// POST /api/fixtures/bulk - Create multiple fixtures
router.post("/bulk", fixtureController.createMultipleFixtures);

// PUT /api/fixtures/:id - Update fixture
router.put("/:id", fixtureController.updateFixture);

// DELETE /api/fixtures/:id - Delete fixture
router.delete("/:id", fixtureController.deleteFixture);

// GET /api/fixtures/:id - Get fixture by ID
router.get("/:id", fixtureController.getFixtureById);

export default router;
