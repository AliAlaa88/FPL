import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const PlayerGameWeek = sequelize.define(
  "PlayerGameWeek",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    player_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "players",
        key: "entry_id",
      },
    },
    gameweek_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "gameweeks",
        key: "id",
      },
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_points: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    transfers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    transfers_cost: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "player_gameweeks",
    timestamps: false,
  }
);

export default PlayerGameWeek;
