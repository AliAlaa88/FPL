import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import GameWeek from "./GameWeek.js";
import Team from "./Team.js";

const Fixture = sequelize.define(
  "Fixture",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    gameweek_id: {
      type: DataTypes.INTEGER,
      references: {
        model: GameWeek,
        key: "id",
      },
      allowNull: false,
    },
    home_team_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Team,
        key: "id",
      },
      allowNull: false,
    },
    away_team_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Team,
        key: "id",
      },
      allowNull: false,
    },
    home_points: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    away_points: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "fixtures",
    timestamps: false, // Assuming you don't want createdAt/updatedAt
  }
);

export default Fixture;
