import { Fixture } from "../../models/index.js";
import { IFixtureRepository } from "../interfaces/IFixtureRepository.js";

export class FixtureRepository extends IFixtureRepository {
  async findAll() {
    return await Fixture.findAll({
      include: [
        { association: "homeTeam" },
        { association: "awayTeam" },
        { association: "gameweek" },
      ],
      order: [["id", "ASC"]],
    });
  }

  async findById(id) {
    return await Fixture.findByPk(id, {
      include: [
        { association: "homeTeam" },
        { association: "awayTeam" },
        { association: "gameweek" },
      ],
    });
  }

  async findByGameWeek(gameWeekId) {
    return await Fixture.findAll({
      where: { gameweek_id: gameWeekId },
      include: [
        { association: "homeTeam" },
        { association: "awayTeam" },
        { association: "gameweek" },
      ],
      order: [["id", "ASC"]],
    });
  }

  async findByTeam(teamId) {
    const { Op } = await import("sequelize");
    return await Fixture.findAll({
      where: {
        [Op.or]: [{ home_team_id: teamId }, { away_team_id: teamId }],
      },
      include: [
        { association: "homeTeam" },
        { association: "awayTeam" },
        { association: "gameweek" },
      ],
      order: [["gameweek_id", "ASC"]],
    });
  }

  async create(fixtureData) {
    return await Fixture.create(fixtureData);
  }

  async update(id, fixtureData) {
    const fixture = await Fixture.findByPk(id);
    if (!fixture) return null;
    return await fixture.update(fixtureData);
  }

  async delete(id) {
    const fixture = await Fixture.findByPk(id);
    if (!fixture) return false;
    await fixture.destroy();
    return true;
  }

  async bulkCreate(fixturesData) {
    return await Fixture.bulkCreate(fixturesData, {
      validate: true,
      ignoreDuplicates: true,
    });
  }
}
