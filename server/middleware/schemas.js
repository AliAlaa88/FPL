import Joi from "joi";

// Fixture validation schemas
export const fixtureSchemas = {
  // GET /api/fixtures/:gameweekNumber
  getFixturesByGameWeek: {
    params: Joi.object({
      gameweekNumber: Joi.number().integer().min(1).required().messages({
        "number.base": "Gameweek number must be a number",
        "number.integer": "Gameweek number must be an integer",
        "number.min": "Gameweek number must be at least 1",
        "any.required": "Gameweek number is required",
      }),
    }),
  },

  // POST /api/fixtures/:gameweekNumber
  createFixtures: {
    params: Joi.object({
      gameweekNumber: Joi.number().integer().min(1).required().messages({
        "number.base": "Gameweek number must be a number",
        "number.integer": "Gameweek number must be an integer",
        "number.min": "Gameweek number must be at least 1",
        "any.required": "Gameweek number is required",
      }),
    }),
    body: Joi.object({
      fixtures: Joi.array()
        .items(
          Joi.object({
            home_team_id: Joi.number()
              .integer()
              .positive()
              .required()
              .messages({
                "number.base": "Home team ID must be a number",
                "number.integer": "Home team ID must be an integer",
                "number.positive": "Home team ID must be positive",
                "any.required": "Home team ID is required",
              }),
            away_team_id: Joi.number()
              .integer()
              .positive()
              .required()
              .messages({
                "number.base": "Away team ID must be a number",
                "number.integer": "Away team ID must be an integer",
                "number.positive": "Away team ID must be positive",
                "any.required": "Away team ID is required",
              }),
            home_points: Joi.number().integer().min(0).default(0),
            away_points: Joi.number().integer().min(0).default(0),
          })
        )
        .min(1)
        .max(10)
        .required()
        .messages({
          "array.base": "Fixtures must be an array",
          "array.min": "At least one fixture is required",
          "array.max": "Maximum 10 fixtures per gameweek allowed",
          "any.required": "Fixtures array is required",
        }),
    }),
  },

  // DELETE /api/fixtures/:gameweekNumber/:fixtureNumber
  deleteFixture: {
    params: Joi.object({
      gameweekNumber: Joi.number().integer().min(1).required().messages({
        "number.base": "Gameweek number must be a number",
        "number.integer": "Gameweek number must be an integer",
        "number.min": "Gameweek number must be at least 1",
        "any.required": "Gameweek number is required",
      }),
      fixtureNumber: Joi.number().integer().min(1).required().messages({
        "number.base": "Fixture number must be a number",
        "number.integer": "Fixture number must be an integer",
        "number.min": "Fixture number must be at least 1",
        "any.required": "Fixture number is required",
      }),
    }),
  },

  // PUT /api/fixtures/:gameweekNumber/:fixtureNumber/result
  updateFixtureResult: {
    params: Joi.object({
      gameweekNumber: Joi.number().integer().min(1).required().messages({
        "number.base": "Gameweek number must be a number",
        "number.integer": "Gameweek number must be an integer",
        "number.min": "Gameweek number must be at least 1",
        "any.required": "Gameweek number is required",
      }),
      fixtureNumber: Joi.number().integer().min(1).required().messages({
        "number.base": "Fixture number must be a number",
        "number.integer": "Fixture number must be an integer",
        "number.min": "Fixture number must be at least 1",
        "any.required": "Fixture number is required",
      }),
    }),
    body: Joi.object({
      home_points: Joi.number().integer().min(0).required().messages({
        "number.base": "Home points must be a number",
        "number.integer": "Home points must be an integer",
        "number.min": "Home points must be non-negative",
        "any.required": "Home points are required",
      }),
      away_points: Joi.number().integer().min(0).required().messages({
        "number.base": "Away points must be a number",
        "number.integer": "Away points must be an integer",
        "number.min": "Away points must be non-negative",
        "any.required": "Away points are required",
      }),
    }),
  },
};

// Team validation schemas
export const teamSchemas = {
  // POST /api/teams
  createTeam: {
    body: Joi.object({
      id: Joi.number().integer().positive().required().messages({
        "number.base": "Team ID must be a number",
        "number.integer": "Team ID must be an integer",
        "number.positive": "Team ID must be positive",
        "any.required": "Team ID is required",
      }),
    }),
  },

  // DELETE /api/teams/:id
  deleteTeam: {
    params: Joi.object({
      id: Joi.number().integer().positive().required().messages({
        "number.base": "Team ID must be a number",
        "number.integer": "Team ID must be an integer",
        "number.positive": "Team ID must be positive",
        "any.required": "Team ID is required",
      }),
    }),
  },

  // PUT /api/teams/:id/gameweek - Update team's gameweek info (captain/chip)
  updateGameweekData: {
    params: Joi.object({
      id: Joi.number().integer().positive().required().messages({
        "number.base": "Team ID must be a number",
        "number.integer": "Team ID must be an integer",
        "number.positive": "Team ID must be positive",
        "any.required": "Team ID is required",
      }),
    }),
    body: Joi.object({
      gameweek: Joi.number().integer().min(1).required().messages({
        "number.base": "Gameweek must be a number",
        "number.integer": "Gameweek must be an integer",
        "number.min": "Gameweek must be at least 1",
        "any.required": "Gameweek is required",
      }),
      captianId: Joi.number()
        .integer()
        .positive()
        .optional()
        .allow(null)
        .messages({
          "number.base": "Captain ID must be a number",
          "number.integer": "Captain ID must be an integer",
          "number.positive": "Captain ID must be positive",
        }),
      chip: Joi.string().trim().optional().messages({
        "string.base": "Chip must be a string",
      }),
    })
      .or("captianId", "chip")
      .messages({
        "object.missing":
          "At least one of 'captianId' or 'chip' must be provided",
      }),
  },
};

// GameWeek validation schemas
export const gameWeekSchemas = {
  // GET /api/gameweeks/:id
  getGameWeekById: {
    params: Joi.object({
      id: Joi.number().integer().positive().required().messages({
        "number.base": "GameWeek ID must be a number",
        "number.integer": "GameWeek ID must be an integer",
        "number.positive": "GameWeek ID must be positive",
        "any.required": "GameWeek ID is required",
      }),
    }),
  },

  // GET /api/gameweeks/week/:weekNumber
  getGameWeekByNumber: {
    params: Joi.object({
      weekNumber: Joi.number().integer().min(1).required().messages({
        "number.base": "Week number must be a number",
        "number.integer": "Week number must be an integer",
        "number.min": "Week number must be at least 1",
        "any.required": "Week number is required",
      }),
    }),
  },

  // POST /api/gameweeks
  createGameWeek: {
    body: Joi.object({
      week_number: Joi.number().integer().min(1).required().messages({
        "number.base": "Week number must be a number",
        "number.integer": "Week number must be an integer",
        "number.min": "Week number must be at least 1",
        "any.required": "Week number is required",
      }),
    }),
  },

  // DELETE /api/gameweeks/:id
  deleteGameWeek: {
    params: Joi.object({
      id: Joi.number().integer().positive().required().messages({
        "number.base": "GameWeek ID must be a number",
        "number.integer": "GameWeek ID must be an integer",
        "number.positive": "GameWeek ID must be positive",
        "any.required": "GameWeek ID is required",
      }),
    }),
  },
};
