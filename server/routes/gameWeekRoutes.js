import express from "express";
import DIContainer from "../container/DIContainer.js";
import { validate, gameWeekSchemas } from "../middleware/index.js";

const router = express.Router();
const gameWeekController = DIContainer.get("GameWeekController");

// GET /api/gameweeks - Get all gameweeks
router.get("/", gameWeekController.getAllGameWeeks);

// GET /api/gameweeks/current - Get current gameweek (specific route first)
router.get("/current", gameWeekController.getCurrentGameWeek);

// POST /api/gameweeks - Create new gameweek
router.post(
  "/",
  validate(gameWeekSchemas.createGameWeek),
  gameWeekController.createGameWeek
);

// GET /api/gameweeks/:id/fixtures - Get gameweek with fixtures
router.get(
  "/:id/fixtures",
  validate(gameWeekSchemas.getGameWeekById),
  gameWeekController.getGameWeekWithFixtures
);

// PUT /api/gameweeks/:id - Update gameweek
router.put("/:id", gameWeekController.updateGameWeek);

// DELETE /api/gameweeks/:id - Delete gameweek
router.delete("/:id", gameWeekController.deleteGameWeek);

// GET /api/gameweeks/:id - Get gameweek by ID
router.get(
  "/:id",
  validate(gameWeekSchemas.getGameWeekById),
  gameWeekController.getGameWeekById
);

export default router;
