import sequelize from "../config/db.js";
import Team from "./Team.js";
import GameWeek from "./GameWeek.js";
import Fixture from "./Fixture.js";

// Define associations
// GameWeek has many Fixtures
GameWeek.hasMany(Fixture, {
  foreignKey: "gameweek_id",
  as: "fixtures",
});

Fixture.belongsTo(GameWeek, {
  foreignKey: "gameweek_id",
  as: "gameweek",
});

// Team has many Fixtures as home team
Team.hasMany(Fixture, {
  foreignKey: "home_team_id",
  as: "homeFixtures",
});

// Team has many Fixtures as away team
Team.hasMany(Fixture, {
  foreignKey: "away_team_id",
  as: "awayFixtures",
});

// Fixture belongs to home team
Fixture.belongsTo(Team, {
  foreignKey: "home_team_id",
  as: "homeTeam",
});

// Fixture belongs to away team
Fixture.belongsTo(Team, {
  foreignKey: "away_team_id",
  as: "awayTeam",
});

// Export all models and sequelize instance
export { sequelize, Team, GameWeek, Fixture };

export default {
  sequelize,
  Team,
  GameWeek,
  Fixture,
};
