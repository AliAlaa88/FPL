import express from "express";
import fixtureRoutes from "./fixtureRoutes.js";
import teamRoutes from "./teamRoutes.js";
import gameWeekRoutes from "./gameWeekRoutes.js";

const router = express.Router();

// Mount routes
router.use("/fixtures", fixtureRoutes);
router.use("/teams", teamRoutes);
router.use("/gameweeks", gameWeekRoutes);

export default router;
