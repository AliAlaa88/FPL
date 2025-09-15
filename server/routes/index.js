import express from "express";
import fixtureRoutes from "./fixtureRoutes.js";
import teamRoutes from "./teamRoutes.js";
import gameWeekRoutes from "./gameWeekRoutes.js";
import TeamService from "../services/TeamService.js";

const router = express.Router();

// Mount routes
router.use("/fixtures", fixtureRoutes);
router.use("/teams", teamRoutes);
router.use("/gameweeks", gameWeekRoutes);
// router.get("/test", async (req, res) => {
//   const teams = await TeamService.getAllTeamsWithPlayers();
//   console.log(teams);
//   res.send("API is working");
// });
export default router;
