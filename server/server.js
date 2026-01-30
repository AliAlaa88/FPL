import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import sequelize from "./config/db.js";
import apiRoutes from "./routes/index.js";
import morgan from "morgan";
import cron from "node-cron";
import { populatePlayerGameWeek } from "./config/populateDB.js";
const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration for production
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

// Middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan("dev"));
// API Routes
app.use("/api", apiRoutes);

// Proxy route for external FPL API
app.get("/api/leagues-classic/:league_id/standings", async (req, res) => {
  const { league_id } = req.params;
  const { page_new_entries, page_standings, phase } = req.query;
  let url = `https://fantasy.premierleague.com/api/leagues-classic/${league_id}/standings/`;
  const params = [];
  if (page_new_entries)
    params.push(`page_new_entries=${encodeURIComponent(page_new_entries)}`);
  if (page_standings)
    params.push(`page_standings=${encodeURIComponent(page_standings)}`);
  if (phase) params.push(`phase=${encodeURIComponent(phase)}`);
  if (params.length) url += `?${params.join("&")}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

function setupCronJobs() {
  // Schedule the job to run daily at 3 AM
  cron.schedule(
    "0 3 * * *",
    async () => {
      console.log("Running daily player gameweek population job at 2 AM");
      try {
        await populatePlayerGameWeek();
        console.log("Player gameweek population job completed");
      } catch (error) {
        console.error("Error during player gameweek population job:", error);
      }
    },
    {
      timezone: "Africa/Cairo", // Set to your desired timezone
    },
  );
}

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
  });
});

app.listen(PORT, async () => {
  console.log(`Proxy server running on port ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    // setupCronJobs();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
