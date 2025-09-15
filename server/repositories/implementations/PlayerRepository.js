import { Player, PlayerGameWeek, Team } from "../../models/index.js";
import { IPlayerRepository } from "../interfaces/IPlayerRepository.js";

export class PlayerRepository extends IPlayerRepository {
  async findAll() {
    return await Player.findAll({
      include: [{ association: "team" }],
      order: [["name", "ASC"]],
    });
  }

  async findById(entryId) {
    return await Player.findByPk(entryId, {
      include: [{ association: "team" }],
    });
  }

  async findByTeam(teamId) {
    return await Player.findAll({
      where: { team_id: teamId },
      include: [{ association: "team" }],
      order: [["name", "ASC"]],
    });
  }

  async findWithGameWeeks(entryId, gameweekNumber = null) {
    const include = {
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
    };

    return await Player.findByPk(entryId, {
      include: [{ association: "team" }, include],
    });
  }

  async create(playerData) {
    return await Player.create(playerData);
  }

  async update(entryId, playerData) {
    const player = await Player.findByPk(entryId);
    if (!player) return null;
    return await player.update(playerData);
  }

  async delete(entryId) {
    const player = await Player.findByPk(entryId);
    if (!player) return false;
    await player.destroy();
    return true;
  }

  async bulkCreate(playersData) {
    return await Player.bulkCreate(playersData, {
      validate: true,
      ignoreDuplicates: true,
    });
  }
}
