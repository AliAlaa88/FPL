import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Captaincy = sequelize.define(
  "Captaincy",
  {
    player_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "players",
        key: "entry_id",
      },
    },
    team_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "teams",
        key: "id",
      },
    },
    gameweek_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "gameweeks",
        key: "id",
      },
    },
  },
  {
    tableName: "captaincy",
    timestamps: false,
    id: false,
    indexes: [
      {
        unique: true,
        fields: ["team_id", "gameweek_id"],
      },
    ],
  }
);

export default Captaincy;
