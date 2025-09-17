// import TeamService from "../services/TeamService.js";
import { TeamRepository } from "../repositories/implementations/TeamRepository.js";
import sequelize from "./db.js";
async function populatePlayers() {
  const teamRepo = new TeamRepository();
  const teams = await teamRepo.findAll();
  console.log(teams);
  for (const team of teams) {
    try {
      const response = await fetch(
        `https://fantasy.premierleague.com/api/leagues-classic/${team.id}/standings/`
      );
      const data = await response.json();
      const players = data.standings.results;
      for (const player of players) {
        await sequelize.query(
          "INSERT INTO players (entry_id, name, team_id) VALUES (?, ?, ?) ON CONFLICT (entry_id) DO NOTHING",
          {
            replacements: [player.entry, player.player_name, team.id],
          }
        );
      }
    } catch (error) {
      console.error(`Error fetching data for team ${team.id}:`, error.message);
      continue;
    }
  }
  console.log("Players populated successfully.");
}

async function populatePlayerGameWeek() {
  const players = await sequelize.query("SELECT entry_id FROM players");
  const entryIds = players[0].map((p) => p.entry_id);
  for (const entryId of entryIds) {
    try {
      const response = await fetch(
        ` https://fantasy.premierleague.com/api/entry/${entryId}/history/`
      );
      const data = await response.json();
      for (const gw of data.current) {
        await sequelize.query(
          "INSERT INTO player_gameweeks (player_id, gameweek_id, points, total_points, transfers, transfers_cost) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT (player_id, gameweek_id) DO NOTHING",
          {
            replacements: [
              entryId,
              gw.event,
              gw.points,
              gw.total_points,
              gw.event_transfers,
              gw.event_transfers_cost,
            ],
          }
        );
      }
    } catch (error) {
      console.error(
        `Error fetching gameweek data for player ${entryId}:`,
        error.message
      );
      continue;
    }
  }
  console.log("Player gameweeks populated successfully.");
}

// populatePlayers();
populatePlayerGameWeek();
