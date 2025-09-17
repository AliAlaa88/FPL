import {
  Team,
  Player,
  PlayerGameWeek,
  sequelize,
  Captaincy,
  Chip,
} from "../../models/index.js";
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
      include: [
        {
          model: Captaincy,
          as: "captaincies",
          required: false, // LEFT JOIN - include teams even without captaincy
          ...(gameweekNumber && { where: { gameweek_id: gameweekNumber } }),
        },
        {
          model: Chip,
          as: "chips",
          required: false, // LEFT JOIN - include teams even without chips
          ...(gameweekNumber && { where: { gameweek_id: gameweekNumber } }),
        },
        include,
      ],
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
  async updateGameweekData(id, gameweek, captianId, chip) {
    const transaction = await sequelize.transaction();
    try {
      const results = {};

      // Upsert captaincy: ensure one captain per (team_id, gameweek_id)
      if (captianId != null) {
        await sequelize.query(
          `
          INSERT INTO captaincy (player_id, team_id, gameweek_id)
          VALUES (?, ?, ?)
          ON CONFLICT (team_id, gameweek_id)
          DO UPDATE SET player_id = EXCLUDED.player_id
          `,
          {
            replacements: [captianId, id, gameweek],
            transaction,
          }
        );
        results.captaincy = {
          player_id: captianId,
          team_id: id,
          gameweek_id: gameweek,
        };
      }

      // Upsert chip: one chip record per (team_id, gameweek_id)
      if (chip != null) {
        await sequelize.query(
          `
          INSERT INTO chips (team_id, gameweek_id, chip)
          VALUES (?, ?, ?)
          ON CONFLICT (team_id, gameweek_id)
          DO UPDATE SET chip = EXCLUDED.chip
          `,
          {
            replacements: [id, gameweek, chip],
            transaction,
          }
        );
        results.chips = { team_id: id, gameweek_id: gameweek, chip };
      }

      await transaction.commit();
      return { success: true, data: results };
    } catch (error) {
      await transaction.rollback();
      throw new Error(`Failed to update gameweek data: ${error.message}`);
    }
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
