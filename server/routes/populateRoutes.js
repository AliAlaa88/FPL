import { Router } from "express";
const router = Router();
router.post("/populate", async (req, res) => {
  try {
    await populatePlayers();
    await populatePlayerGameWeek();
    await populateFixturesPoints();
    res.status(200).json({ message: "Data populated successfully" });
  } catch (error) {
    console.error("Error populating data:", error);
    res.status(500).json({ error: "Failed to populate data" });
  }
});
export default router;
