import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Player = sequelize.define(
  "Player",
  {
    entry_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    team_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "teams",
        key: "id",
      },
    },
  },
  {
    tableName: "players",
    timestamps: false,
  }
);

export default Player;
