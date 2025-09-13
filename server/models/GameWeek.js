import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const GameWeek = sequelize.define(
  "GameWeek",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    week_number: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
    },
  },
  {
    tableName: "gameweeks",
    timestamps: false, // Assuming you don't want createdAt/updatedAt
  }
);

export default GameWeek;
