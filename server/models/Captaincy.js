import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Captaincy = sequelize.define(
  "Captaincy",
  {
    player_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    team_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "teams",
        key: "id",
      },
    },
    gameweek_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "gameweeks",
        key: "id",
      },
    },
  },
  {
    tableName: "captaincy",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["team_id", "gameweek_id"],
      },
    ],
  }
);

export default Captaincy;
