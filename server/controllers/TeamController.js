import TeamService from "../services/TeamService.js";

class TeamController {
  // GET /api/teams - Returns array of 20 teams with all info (id, name, team_points, players[])
  async getAllTeams(req, res) {
    try {
      const teams = await TeamService.getAllTeams();
      res.status(200).json({
        success: true,
        data: teams,
        message: "Teams fetched successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // POST /api/teams - Takes team id, saves it to DB and calculates points from fixtures
  async createTeam(req, res) {
    try {
      const { id } = req.body;

      const team = await TeamService.createTeam({ id });
      res.status(201).json({
        success: true,
        data: team,
        message: "Team created/updated successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // DELETE /api/teams/:id - Delete team
  async deleteTeam(req, res) {
    try {
      const { id } = req.params;

      const result = await TeamService.deleteTeam(id);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new TeamController();
