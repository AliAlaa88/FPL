import { Player, PlayerGameWeek, Team } from "../models/index.js";

class TeamService {
  // Get all teams
  async getAllTeams() {
    try {
      const teams = await Team.findAll({
        order: [["name", "ASC"]],
      });
      return teams;
    } catch (error) {
      throw new Error(`Error fetching teams: ${error.message}`);
    }
  }
  // GET Teams with Players Data
  async getTeamsWithPlayers(gameweekNumber) {
    try {
      const teams = await Team.findAll({
        include: [
          {
            model: Player,
            as: "players",
            include: [
              {
                model: PlayerGameWeek,
                as: "gameweeks",
                ...((gameweekNumber && {
                  where: { gameweek_id: gameweekNumber },
                }) ||
                  {}),
                attributes: [
                  "gameweek_id",
                  "player_id",
                  "points",
                  "total_points",
                  "transfers",
                  "transfers_cost",
                ],
              },
            ],
          },
        ],
        order: [["name", "ASC"]],
      });
      return teams;
    } catch (error) {
      throw new Error(`Error fetching teams with players: ${error.message}`);
    }
  }
  // Get team by ID
  async getTeamById(id) {
    try {
      const team = await Team.findByPk(id);
      if (!team) {
        throw new Error("Team not found");
      }
      return team;
    } catch (error) {
      throw new Error(`Error fetching team: ${error.message}`);
    }
  }

  // Get team by name
  async getTeamByName(name) {
    try {
      const team = await Team.findOne({
        where: { name },
      });
      if (!team) {
        throw new Error("Team not found");
      }
      return team;
    } catch (error) {
      throw new Error(`Error fetching team: ${error.message}`);
    }
  }

  // Create a new team
  async createTeam(teamData) {
    try {
      const { name } = teamData;

      // Check if team already exists
      const existingTeam = await Team.findOne({ where: { name } });
      if (existingTeam) {
        throw new Error("Team already exists");
      }

      const team = await Team.create({ name });
      return team;
    } catch (error) {
      throw new Error(`Error creating team: ${error.message}`);
    }
  }

  // Update team
  async updateTeam(id, teamData) {
    try {
      const team = await Team.findByPk(id);
      if (!team) {
        throw new Error("Team not found");
      }

      const updatedTeam = await team.update(teamData);
      return updatedTeam;
    } catch (error) {
      throw new Error(`Error updating team: ${error.message}`);
    }
  }

  // Delete team
  async deleteTeam(id) {
    try {
      const team = await Team.findByPk(id);
      if (!team) {
        throw new Error("Team not found");
      }

      await team.destroy();
      return { message: "Team deleted successfully" };
    } catch (error) {
      throw new Error(`Error deleting team: ${error.message}`);
    }
  }

  // Get team with fixtures (home and away)
  async getTeamWithFixtures(id) {
    try {
      const team = await Team.findByPk(id, {
        include: [
          {
            association: "homeFixtures",
            include: [{ association: "awayTeam" }, { association: "gameweek" }],
          },
          {
            association: "awayFixtures",
            include: [{ association: "homeTeam" }, { association: "gameweek" }],
          },
        ],
      });

      if (!team) {
        throw new Error("Team not found");
      }

      return team;
    } catch (error) {
      throw new Error(`Error fetching team with fixtures: ${error.message}`);
    }
  }

  // Create multiple teams
  async createMultipleTeams(teamsData) {
    try {
      const teams = await Team.bulkCreate(teamsData, {
        validate: true,
        ignoreDuplicates: true,
      });
      return teams;
    } catch (error) {
      throw new Error(`Error creating teams: ${error.message}`);
    }
  }
}

export default new TeamService();
