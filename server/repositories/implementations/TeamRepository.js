import {
  Team,
  Player,
  PlayerGameWeek,
  sequelize,
  Captaincy,
  Chip,
} from "../../models/index.js";
import { ITeamRepository } from "../interfaces/ITeamRepository.js";
import { Op } from "sequelize";

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
          // Get ALL chips (not filtered by gameweek) so we can filter in service layer
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

  async findByIdWithHistory(id) {
    return await Team.findByPk(id, {
      include: [
        {
          model: Player,
          as: "players",
          include: [
            {
              model: PlayerGameWeek,
              as: "gameweeks",
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
        {
          model: Captaincy,
          as: "captaincies",
          attributes: ["gameweek_id", "player_id"],
        },
        {
          model: Chip,
          as: "chips",
          attributes: ["gameweek_id", "chip"],
        },
        {
          association: "homeFixtures",
          attributes: ["gameweek_id", "home_points", "away_points"],
          include: [{ association: "awayTeam", attributes: ["id", "name"] }],
        },
        {
          association: "awayFixtures",
          attributes: ["gameweek_id", "home_points", "away_points"],
          include: [{ association: "homeTeam", attributes: ["id", "name"] }],
        },
      ],
      order: [
        [
          { model: Player, as: "players" },
          { model: PlayerGameWeek, as: "gameweeks" },
          "gameweek_id",
          "ASC",
        ],
      ],
    });
  }
  async updateGameweekData(id, gameweek, captianId, chip) {
    const transaction = await sequelize.transaction();
    try {
      const results = {};

      // Upsert captaincy: ensure one captain per (team_id, gameweek_id)
      // Always insert/update captaincy record, even if captianId is null
      await sequelize.query(
        `
          INSERT INTO captaincy (player_id, team_id, gameweek_id)
          VALUES (?, ?, ?)
          ON CONFLICT (team_id, gameweek_id)
          DO UPDATE SET player_id = EXCLUDED.player_id
          `,
        {
          replacements: [captianId || null, id, gameweek],
          transaction,
        }
      );
      results.captaincy = {
        player_id: captianId || null,
        team_id: id,
        gameweek_id: gameweek,
      };

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
