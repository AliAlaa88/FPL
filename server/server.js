import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

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

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
