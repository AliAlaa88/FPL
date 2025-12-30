import express from "express";
import DIContainer from "../container/DIContainer.js";

const router = express.Router();

const standingsController = DIContainer.get("StandingsController");

// GET /api/standings/
router.get("/", standingsController.getStandings);

export default router;
