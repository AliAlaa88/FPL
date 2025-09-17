import { sequelize } from "../../models/index.js";
export class standingsRepository {
  async getStandings(gameWeek) {
    try {
      const query = gameWeek
        ? `SELECT
          t.id AS team_id,
          t.name,
          SUM(
            CASE
              WHEN f.home_team_id = t.id AND f.home_points > f.away_points THEN 3
              WHEN f.away_team_id = t.id AND f.away_points > f.home_points THEN 3
              WHEN f.home_points = f.away_points THEN 1
              ELSE 0
            END
          ) AS league_points,
          SUM(
            CASE WHEN f.home_team_id = t.id THEN COALESCE(f.home_points,0)
                WHEN f.away_team_id = t.id THEN COALESCE(f.away_points,0)
                ELSE 0 END
          ) AS goals_for,
          SUM(
            CASE WHEN f.home_team_id = t.id THEN COALESCE(f.away_points,0)
                WHEN f.away_team_id = t.id THEN COALESCE(f.home_points,0)
                ELSE 0 END
          ) AS goals_against
        FROM teams t
        LEFT JOIN fixtures f
          ON t.id IN (f.home_team_id, f.away_team_id)
          Where gameweek_id <= ?
        GROUP BY t.id, t.name
        order by league_points DESC;`
        : `select * from standings order by league_points DESC;`;
      const standings = await sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
        ...(gameWeek && { replacements: [gameWeek] }),
      });
      return standings;
    } catch (error) {
      throw new Error("Error fetching standings: " + error.message);
    }
  }
}
