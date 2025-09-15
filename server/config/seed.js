import { GameWeek, Team } from "../models/index.js";
import sequelize from "./db.js";
async function seed() {
  try {
    // Example data for each model (customize as needed)
    const ids = [
      418940, 307140, 767007, 805231, 712543, 863026, 673216, 1074101, 666058,
      572827, 348627, 384960, 2193, 2587078, 797003, 798822, 400715, 412945,
      601655, 576117,
    ];
    const teams = [];
    for (const id of ids) {
      try {
        const res = await fetch(
          `https://fantasy.premierleague.com/api/leagues-classic/${id}/standings/`
        );
        const data = await res.json();
        console.log("id : ", id, "leage name", data.league.name);
        teams.push({ id, name: data.league.name });
      } catch (err) {
        console.error("Error fetching league with id:", id, err);
        teams.push({ id, name: `League ${id}` });
      }
    }
    // Clear existing data (optional)
    //await sequelize.sync({ force: true });
    // Seed data
    await Team.bulkCreate(teams, { ignoreDuplicates: true });
    // Seed GameWeeks
    for (let i = 1; i <= 3; i++) {
      await GameWeek.create({ week_number: i });
    }
    // fixtures for gameweek 1

    console.log("Database seeded!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();
