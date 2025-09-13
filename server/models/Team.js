import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Team = sequelize.define(
  "Team",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: "teams",
    timestamps: false, // Assuming you don't want createdAt/updatedAt
  }
);

export default Team;
