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

export async function populatePlayerGameWeek() {
  const players = await sequelize.query("SELECT entry_id FROM players");
  const entryIds = players[0].map((p) => p.entry_id);

  // 1. Process in smaller batches to avoid overwhelming the API
  const BATCH_SIZE = 10;
  const CONCURRENT_LIMIT = 3; // Limit concurrent requests to be respectful to the API

  for (let i = 0; i < entryIds.length; i += BATCH_SIZE) {
    const batch = entryIds.slice(i, i + BATCH_SIZE);

    // 2. Use Promise.allSettled with concurrency limit
    const promises = batch.map(async (entryId) => {
      try {
        const response = await fetch(
          `https://fantasy.premierleague.com/api/entry/${entryId}/history/`
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return { entryId, gameweeks: data.current };
      } catch (error) {
        console.error(
          `Error fetching gameweek data for player ${entryId}:`,
          error.message
        );
        return { entryId, error: error.message };
      }
    });

    const results = await Promise.allSettled(promises);

    // 3. Batch database inserts
    const insertData = [];
    for (const result of results) {
      if (result.status === "fulfilled" && result.value.gameweeks) {
        const { entryId, gameweeks } = result.value;
        for (const gw of gameweeks) {
          if (entryId == 2893375 && gw.event > 3) continue; // Skip known bad data
          insertData.push([
            entryId,
            gw.event,
            gw.points,
            gw.total_points,
            gw.event_transfers,
            gw.event_transfers_cost,
          ]);
        }
      }
    }

    // 4. Bulk insert instead of individual queries
    if (insertData.length > 0) {
      try {
        await sequelize.query(
          `INSERT INTO player_gameweeks (player_id, gameweek_id, points, total_points, transfers, transfers_cost) 
           VALUES ${insertData.map(() => "(?, ?, ?, ?, ?, ?)").join(", ")} 
           ON CONFLICT (player_id, gameweek_id) DO NOTHING`,
          {
            replacements: insertData.flat(),
          }
        );
      } catch (error) {
        console.error("Error inserting batch data:", error.message);
      }
    }

    console.log(
      `Processed batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(
        entryIds.length / BATCH_SIZE
      )}`
    );

    // 5. Add delay between batches to be respectful to the API
    if (i + BATCH_SIZE < entryIds.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay
    }
  }

  console.log("Player gameweeks populated successfully.");
}

// populatePlayers();
//populatePlayerGameWeek();
