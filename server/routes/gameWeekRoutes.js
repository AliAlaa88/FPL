import express from "express";
import GameWeekController from "../controllers/GameWeekController.js";
import { validate, gameWeekSchemas } from "../middleware/index.js";

const router = express.Router();

// GET /api/gameweeks - Get all gameweeks
router.get("/", GameWeekController.getAllGameWeeks);

// GET /api/gameweeks/current - Get current gameweek (specific route first)
router.get("/current", GameWeekController.getCurrentGameWeek);

// GET /api/gameweeks/week/:weekNumber - Get gameweek by week number
router.get(
  "/week/:weekNumber",
  validate(gameWeekSchemas.getGameWeekByNumber),
  GameWeekController.getGameWeekByNumber
);

// POST /api/gameweeks - Create new gameweek
router.post(
  "/",
  validate(gameWeekSchemas.createGameWeek),
  GameWeekController.createGameWeek
);

// GET /api/gameweeks/:id/fixtures - Get gameweek with fixtures
router.get(
  "/:id/fixtures",
  validate(gameWeekSchemas.getGameWeekById),
  GameWeekController.getGameWeekWithFixtures
);

// GET /api/gameweeks/:id - Get gameweek by ID
router.get(
  "/:id",
  validate(gameWeekSchemas.getGameWeekById),
  GameWeekController.getGameWeekById
);

export default router;
