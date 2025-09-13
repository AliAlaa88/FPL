import express from "express";
import TeamController from "../controllers/TeamController.js";
import { validate, teamSchemas } from "../middleware/index.js";

const router = express.Router();

// GET /api/teams - Get all teams
router.get("/", TeamController.getAllTeams);
// GET /api/teams/:gameweek - Get team by gameweek
router.get(
  "/:gameweekNumber",
  //validate(teamSchemas.getTeamByGameWeek),
  TeamController.getTeamsByGameWeek
);
// POST /api/teams - Create a team
router.post("/", validate(teamSchemas.createTeam), TeamController.createTeam);

// DELETE /api/teams/:id - Delete team
router.delete(
  "/:id",
  validate(teamSchemas.deleteTeam),
  TeamController.deleteTeam
);

export default router;
