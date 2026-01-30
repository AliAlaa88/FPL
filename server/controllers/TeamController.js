export class TeamController {
  constructor(teamService) {
    this.teamService = teamService;
  }

  // Get all teams
  getAllTeams = async (req, res) => {
    try {
      const teams = await this.teamService.getAllTeams();
      res.json(teams);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Get team by ID
  getTeamById = async (req, res) => {
    try {
      const { id } = req.params;
      const team = await this.teamService.getTeamById(id);
      res.json(team);
    } catch (error) {
      if (error.message.includes("not found")) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  };

  // Get teams with players
  getTeamsWithPlayers = async (req, res) => {
    try {
      const { gameweek } = req.query;
      const teams = await this.teamService.getTeamsWithPlayers(gameweek);
      teams.map((team) => {
        team.captaincies.map((cap) => {
          if (!cap.player_id || cap.player_id === null) {
            cap.dataValues.player_id = 0;
          }
          return cap;
        });
        return team;
      });
      res.json(teams);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Create team
  createTeam = async (req, res) => {
    try {
      const team = await this.teamService.createTeam(req.body);
      res.status(201).json(team);
    } catch (error) {
      if (
        error.message.includes("already exists") ||
        error.message.includes("required")
      ) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  };

  // Update team
  updateTeam = async (req, res) => {
    try {
      const { id } = req.params;
      const team = await this.teamService.updateTeam(id, req.body);
      res.json(team);
    } catch (error) {
      if (error.message.includes("not found")) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  };
  updateTeamGameweekData = async (req, res) => {
    try {
      const { id } = req.params;
      const { gameweek, captianId, chip } = req.body;
      const team = await this.teamService.updateTeamGameweekData(
        id,
        gameweek,
        captianId,
        chip
      );
      res.json(team);
    } catch (error) {
      if (error.message.includes("not found")) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  };

  // Delete team
  deleteTeam = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.teamService.deleteTeam(id);
      res.json(result);
    } catch (error) {
      if (error.message.includes("not found")) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  };

  // Get team with fixtures
  getTeamWithFixtures = async (req, res) => {
    try {
      const { id } = req.params;
      const team = await this.teamService.getTeamWithFixtures(id);
      res.json(team);
    } catch (error) {
      if (error.message.includes("not found")) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  };

  // Get team history (all GWs)
  getTeamHistory = async (req, res) => {
    try {
      const { id } = req.params;
      const team = await this.teamService.getTeamHistory(id);
      res.json(team);
    } catch (error) {
      if (error.message.includes("not found")) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  };

  // Create multiple teams
  createMultipleTeams = async (req, res) => {
    try {
      const teams = await this.teamService.createMultipleTeams(req.body);
      res.status(201).json(teams);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
