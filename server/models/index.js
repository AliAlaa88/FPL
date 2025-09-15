import sequelize from "../config/db.js";
import Team from "./Team.js";
import GameWeek from "./GameWeek.js";
import Fixture from "./Fixture.js";
import Player from "./Player.js";
import PlayerGameWeek from "./PlayerGameWeek.js";
import Captaincy from "./Captaincy.js";
import Chip from "./Chip.js";

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

// Team has many Players
Team.hasMany(Player, {
  foreignKey: "team_id",
  as: "players",
});

// Player belongs to Team
Player.belongsTo(Team, {
  foreignKey: "team_id",
  as: "team",
});

// Player has many PlayerGameWeeks
Player.hasMany(PlayerGameWeek, {
  foreignKey: "player_id",
  as: "gameweeks",
});

// PlayerGameWeek belongs to Player
PlayerGameWeek.belongsTo(Player, {
  foreignKey: "player_id",
  as: "player",
});

// GameWeek has many PlayerGameWeeks
GameWeek.hasMany(PlayerGameWeek, {
  foreignKey: "gameweek_id",
  as: "playerGameweeks",
});

// PlayerGameWeek belongs to GameWeek
PlayerGameWeek.belongsTo(GameWeek, {
  foreignKey: "gameweek_id",
  as: "gameweek",
});

// Team has many Captaincies
Team.hasMany(Captaincy, {
  foreignKey: "team_id",
  as: "captaincies",
});

// Captaincy belongs to Team
Captaincy.belongsTo(Team, {
  foreignKey: "team_id",
  as: "team",
});

// GameWeek has many Captaincies
GameWeek.hasMany(Captaincy, {
  foreignKey: "gameweek_id",
  as: "captaincies",
});

// Captaincy belongs to GameWeek
Captaincy.belongsTo(GameWeek, {
  foreignKey: "gameweek_id",
  as: "gameweek",
});

// Team has many Chips
Team.hasMany(Chip, {
  foreignKey: "team_id",
  as: "chips",
});

// Chip belongs to Team
Chip.belongsTo(Team, {
  foreignKey: "team_id",
  as: "team",
});

// GameWeek has many Chips
GameWeek.hasMany(Chip, {
  foreignKey: "gameweek_id",
  as: "chips",
});

// Chip belongs to GameWeek
Chip.belongsTo(GameWeek, {
  foreignKey: "gameweek_id",
  as: "gameweek",
});

// Export all models and sequelize instance
export {
  sequelize,
  Team,
  GameWeek,
  Fixture,
  Player,
  PlayerGameWeek,
  Captaincy,
  Chip,
};

export default {
  sequelize,
  Team,
  GameWeek,
  Fixture,
  Player,
  PlayerGameWeek,
  Captaincy,
  Chip,
};
