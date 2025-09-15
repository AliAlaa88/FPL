import { sequelize } from "../../models/index.js";
export class standingsRepository {
  async getStandings() {
    try {
      const standings = await sequelize.query(
        `select * from standings order by league_points DESC;`,
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );
      return standings;
    } catch (error) {
      throw new Error("Error fetching standings: " + error.message);
    }
  }
}
