export class TeamService {
  constructor(teamRepository) {
    this.teamRepository = teamRepository;
  }

  // Get all teams
  async getAllTeams() {
    try {
      const teams = await this.teamRepository.findAll();
      return teams;
    } catch (error) {
      throw new Error(`Error fetching teams: ${error.message}`);
    }
  }

  // GET Teams with Players Data
  async getTeamsWithPlayers(gameweekNumber) {
    try {
      const teams = await this.teamRepository.findAllWithPlayers(
        gameweekNumber
      );

      // Process chips for each team
      teams.forEach((team) => {
        if (gameweekNumber) {
          // Filter chips into current and previous
          team.dataValues.prevChips = team.chips.filter(
            (chip) => chip.gameweek_id < gameweekNumber
          );

          // Update chips to only include current gameweek
          team.dataValues.chips = team.chips.filter(
            (chip) => chip.gameweek_id === parseInt(gameweekNumber)
          );
        } else {
          // If no gameweek specified, prevChips is empty
          team.dataValues.prevChips = [];
        }
      });

      return teams;
    } catch (error) {
      throw new Error(`Error fetching teams with players: ${error.message}`);
    }
  }
  // Get team by ID
  async getTeamById(id) {
    try {
      const team = await this.teamRepository.findById(id);
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
      const team = await this.teamRepository.findByName(name);
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

      // Business logic validation
      if (!name?.trim()) {
        throw new Error("Team name is required");
      }

      // Check if team already exists
      const existingTeam = await this.teamRepository.findByName(name);
      if (existingTeam) {
        throw new Error("Team already exists");
      }

      const team = await this.teamRepository.create({ name });
      return team;
    } catch (error) {
      throw new Error(`Error creating team: ${error.message}`);
    }
  }
  async updateTeamGameweekData(id, gameweekData, captianId, chip) {
    try {
      const updatedTeam = await this.teamRepository.updateGameweekData(
        id,
        gameweekData,
        captianId,
        chip
      );
      if (!updatedTeam) {
        throw new Error("Team not found");
      }
      return updatedTeam;
    } catch (error) {
      throw new Error(`Error updating team gameweek data: ${error.message}`);
    }
  }

  // Update team
  async updateTeam(id, teamData) {
    try {
      const updatedTeam = await this.teamRepository.update(id, teamData);
      if (!updatedTeam) {
        throw new Error("Team not found");
      }
      return updatedTeam;
    } catch (error) {
      throw new Error(`Error updating team: ${error.message}`);
    }
  }

  // Delete team
  async deleteTeam(id) {
    try {
      const deleted = await this.teamRepository.delete(id);
      if (!deleted) {
        throw new Error("Team not found");
      }
      return { message: "Team deleted successfully" };
    } catch (error) {
      throw new Error(`Error deleting team: ${error.message}`);
    }
  }

  // Get team with fixtures (home and away)
  async getTeamWithFixtures(id) {
    try {
      const team = await this.teamRepository.findByIdWithFixtures(id);
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
      const teams = await this.teamRepository.bulkCreate(teamsData);
      return teams;
    } catch (error) {
      throw new Error(`Error creating teams: ${error.message}`);
    }
  }

  async getAllTeamsWithPlayers() {
    try {
      return await this.teamRepository.findAllWithPlayers();
    } catch (error) {
      throw new Error(`Error fetching teams with players: ${error.message}`);
    }
  }
}
