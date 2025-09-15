import { GameWeek } from "../../models/index.js";
import { IGameWeekRepository } from "../interfaces/IGameWeekRepository.js";

export class GameWeekRepository extends IGameWeekRepository {
  async findAll() {
    return await GameWeek.findAll({
      order: [["week_number", "ASC"]],
    });
  }

  async findById(id) {
    return await GameWeek.findByPk(id);
  }

  async findByWeekNumber(weekNumber) {
    return await GameWeek.findOne({
      where: { week_number: weekNumber },
    });
  }

  async findWithFixtures(id) {
    return await GameWeek.findByPk(id, {
      include: [
        {
          association: "fixtures",
          include: [{ association: "homeTeam" }, { association: "awayTeam" }],
        },
      ],
    });
  }

  async create(gameWeekData) {
    return await GameWeek.create(gameWeekData);
  }

  async update(id, gameWeekData) {
    const gameWeek = await GameWeek.findByPk(id);
    if (!gameWeek) return null;
    return await gameWeek.update(gameWeekData);
  }

  async delete(id) {
    const gameWeek = await GameWeek.findByPk(id);
    if (!gameWeek) return false;
    await gameWeek.destroy();
    return true;
  }

  async getCurrentGameWeek() {
    return await GameWeek.findOne({
      order: [["week_number", "DESC"]],
    });
  }
}
