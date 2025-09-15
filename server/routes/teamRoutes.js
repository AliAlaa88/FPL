import express from "express";
import DIContainer from "../container/DIContainer.js";
import { validate, teamSchemas } from "../middleware/index.js";

const router = express.Router();
const teamController = DIContainer.get("TeamController");

// GET /api/teams - Get all teams
router.get("/", teamController.getAllTeams);

// GET /api/teams/with-players - Get teams with players (query param: ?gameweek=X)
router.get("/with-players", teamController.getTeamsWithPlayers);

// POST /api/teams/bulk - Create multiple teams
router.post("/bulk", teamController.createMultipleTeams);

// GET /api/teams/:id - Get team by ID
router.get("/:id", teamController.getTeamById);

// GET /api/teams/:id/fixtures - Get team with fixtures
router.get("/:id/fixtures", teamController.getTeamWithFixtures);

// POST /api/teams - Create a team
router.post("/", validate(teamSchemas.createTeam), teamController.createTeam);

// PUT /api/teams/:id - Update team
router.put("/:id", teamController.updateTeam);

// DELETE /api/teams/:id - Delete team
router.delete(
  "/:id",
  validate(teamSchemas.deleteTeam),
  teamController.deleteTeam
);

export default router;
