import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import sequelize from "./config/db.js";
import apiRoutes from "./routes/index.js";
import morgan from "morgan";

const app = express();

// CORS configuration for production
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

// Initialize database connection (cached for warm starts)
let isDbConnected = false;

const connectDb = async () => {
  if (!isDbConnected) {
    try {
      await sequelize.authenticate();
      console.log("Database connection established.");
      isDbConnected = true;
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }
  }
};

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      // Allow Netlify preview/deploy URLs
      if (origin.endsWith('.netlify.app')) return callback(null, true);
      
      // Allow explicitly listed origins
      if (allowedOrigins.includes(origin)) return callback(null, true);
      
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan("dev"));

// Middleware to ensure DB connection on each request
app.use(async (req, res, next) => {
  try {
    await connectDb();
    next();
  } catch (error) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

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

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
  });
});

// Export for serverless
// export const handler = serverless(app);

// For local development
export default app;
