import Joi from "joi";
import {
  validate,
  fixtureSchemas,
  teamSchemas,
  gameWeekSchemas,
} from "./middleware/index.js";

console.log("🧪 Testing Joi Validation Setup\n");

// Test Joi schema validation directly
const testData = {
  validGameweek: { gameweekNumber: "1" },
  invalidGameweek: { gameweekNumber: "invalid" },
  validTeam: { id: 123456 },
  invalidTeam: { id: "invalid" },
};

console.log("✅ Testing gameweek schema validation:");
const gameweekResult1 = fixtureSchemas.getFixturesByGameWeek.params.validate(
  testData.validGameweek
);
console.log("Valid gameweek:", gameweekResult1.error ? "FAILED" : "PASSED");

const gameweekResult2 = fixtureSchemas.getFixturesByGameWeek.params.validate(
  testData.invalidGameweek
);
console.log(
  "Invalid gameweek:",
  gameweekResult2.error ? "FAILED (Expected)" : "PASSED (Unexpected)"
);

console.log("\n✅ Testing team schema validation:");
const teamResult1 = teamSchemas.createTeam.body.validate(testData.validTeam);
console.log("Valid team:", teamResult1.error ? "FAILED" : "PASSED");

const teamResult2 = teamSchemas.createTeam.body.validate(testData.invalidTeam);
console.log(
  "Invalid team:",
  teamResult2.error ? "FAILED (Expected)" : "PASSED (Unexpected)"
);

console.log("\n🎉 Schema validation tests completed!");

if (gameweekResult2.error) {
  console.log(
    "\n📋 Example validation error:",
    gameweekResult2.error.details[0].message
  );
}

if (teamResult2.error) {
  console.log(
    "📋 Example validation error:",
    teamResult2.error.details[0].message
  );
}
