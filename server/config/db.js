import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Load .env only for local development
// In production (Netlify), env vars are injected directly
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

export default sequelize;
