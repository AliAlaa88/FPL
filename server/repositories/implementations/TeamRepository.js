import { Team, Player, PlayerGameWeek } from "../../models/index.js";
import { ITeamRepository } from "../interfaces/ITeamRepository.js";

export class TeamRepository extends ITeamRepository {
  async findAll() {
    return await Team.findAll({
      order: [["name", "ASC"]],
    });
  }

  async findById(id) {
    return await Team.findByPk(id);
  }

  async findByName(name) {
    return await Team.findOne({
      where: { name },
    });
  }

  async findAllWithPlayers(gameweekNumber = null) {
    const include = {
      model: Player,
      as: "players",
      include: [
        {
          model: PlayerGameWeek,
          as: "gameweeks",
          ...(gameweekNumber && { where: { gameweek_id: gameweekNumber } }),
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
    };

    return await Team.findAll({
      include: [include],
      order: [["name", "ASC"]],
    });
  }

  async findByIdWithFixtures(id) {
    return await Team.findByPk(id, {
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
  }

  async create(teamData) {
    return await Team.create(teamData);
  }

  async update(id, teamData) {
    const team = await Team.findByPk(id);
    if (!team) return null;
    return await team.update(teamData);
  }

  async delete(id) {
    const team = await Team.findByPk(id);
    if (!team) return false;
    await team.destroy();
    return true;
  }

  async bulkCreate(teamsData) {
    return await Team.bulkCreate(teamsData, {
      validate: true,
      ignoreDuplicates: true,
    });
  }
}
