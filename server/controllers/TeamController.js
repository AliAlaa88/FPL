import TeamService from "../services/TeamService.js";

async function getTeamPlayers(teamid) {
  try {
    const response = await fetch(
      `https://fantasy.premierleague.com/api/leagues-classic/${teamid}/standings/`
    );
    const data = await response.json();
    return data.standings.results;
  } catch (error) {
    console.error(`Error fetching data for team ${teamid}:`, error.message);
    return [];
  }
}

// Helper function: Get teams with their players
async function getTeamsWithPlayers(teams) {
  const teamPromises = teams.map(async (team) => {
    const team_players = await getTeamPlayers(team.id);
    return {
      id: team.id,
      name: team.name,
      team_players: team_players,
    };
  });

  return await Promise.all(teamPromises);
}

// Helper function: Add gameweek data to teams
async function addGameweekDataToTeams(teams, gameweekNumber) {
  const teamsWithPointsPromises = teams.map(async (team, teamIndex) => {
    // Rate limiting: Add small delay between teams
    if (teamIndex > 0) {
      await new Promise((resolve) => setTimeout(resolve, 100 * teamIndex));
    }

    const playersWithGameweekData = await getPlayersGameweekData(
      team.team_players,
      gameweekNumber
    );

    return {
      ...team,
      team_players: playersWithGameweekData,
    };
  });

  return await Promise.all(teamsWithPointsPromises);
}

// Helper function: Get gameweek data for all players in a team
async function getPlayersGameweekData(players, gameweekNumber) {
  const playerPromises = players.map(async (player) => {
    return await getPlayerGameweekData(player, gameweekNumber);
  });

  return await Promise.all(playerPromises);
}

// Helper function: Get individual player's gameweek data
async function getPlayerGameweekData(player, gameweekNumber) {
  try {
    const response = await fetch(
      `https://fantasy.premierleague.com/api/entry/${player.entry}/history/`
    );

    if (!response.ok) {
      return {
        ...player,
        gameweek_points: 0,
        error: `HTTP ${response.status}`,
      };
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return {
        ...player,
        gameweek_points: 0,
        error: "Non-JSON response",
      };
    }

    const data = await response.json();
    const currentSeasonHistory = data.current || [];

    const gameweekData = currentSeasonHistory.find(
      (gw) => gw.event === gameweekNumber
    );

    return {
      ...player,
      gameweek_points: gameweekData?.points || 0,
      gameweek_rank: gameweekData?.rank || null,
      gameweek_transfers: gameweekData?.event_transfers || 0,
      gameweek_transfers_cost: gameweekData?.event_transfers_cost || 0,
      total_points: gameweekData?.total_points || 0,
    };
  } catch (error) {
    return {
      ...player,
      gameweek_points: 0,
      error: error.message,
    };
  }
}

class TeamController {
  // GET /api/teams - Returns array of 20 teams with all info (id, name, team_points, players[])
  async getAllTeams(req, res) {
    try {
      const teams = await TeamService.getTeamsWithPlayers();

      res.status(200).json({
        success: true,
        data: teams,
        message: "Teams fetched successfully",
      });
    } catch (error) {
      // console.log(error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  // GET /api/teams/:gameweekNumber - Returns array of 20 teams with all info (id, name, team_points, players[])
  async getTeamsByGameWeek(req, res) {
    try {
      const { gameweekNumber } = req.params;
      const teams = await TeamService.getTeamsWithPlayers(gameweekNumber);
      res.status(200).json({
        success: true,
        data: teams,
        message: `Teams for gameweek ${gameweekNumber} fetched successfully`,
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
