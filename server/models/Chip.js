import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Chip = sequelize.define(
  "Chip",
  {
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
    chip: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "chips",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["team_id", "gameweek_id"],
      },
    ],
  }
);

export default Chip;
