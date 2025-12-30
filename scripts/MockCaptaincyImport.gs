/**
 * FPL Captaincy Import - MOCK VERSION
 * Use this to test and verify the parsing logic without database access
 *
 * Instructions:
 * 1. Open your Google Sheet
 * 2. Go to Extensions → Apps Script
 * 3. Paste this code and save
 * 4. Run debugColors() first to check your sheet's color hex codes
 * 5. Run mockExportCaptaincyForGameweek() to test
 * 6. Check View → Logs to see the output
 */

// ============== CONFIGURATION ==============
const CONFIG = {
  GAMEWEEK: 16, // <-- Change this to your target gameweek
  API_URL: "http://localhost:3000/api/teams", // <-- Your API base URL

  // Color definitions (run debugColors() to find your exact hex codes)
  COLORS: {
    RED: ["#ff0000", "#ea9999", "#e06666", "#cc0000", "#990000", "#f4cccc"],
    GREEN: ["#00ff00", "#93c47d", "#b6d7a8", "#6aa84f", "#38761d", "#d9ead3"],
    CYAN: ["#00ffff", "#76a5af", "#a2c4c9", "#45818e", "#134f5c", "#d0e0e3"],
    ORANGE: ["#ff9900", "#f6b26b", "#e69138", "#b45f06", "#783f04", "#fce5cd"],
  },
};

// ============== COLOR DETECTION ==============
function isColorMatch(cellColor, colorArray) {
  const normalizedCell = cellColor.toLowerCase().trim();
  return colorArray.some((c) => c.toLowerCase() === normalizedCell);
}

function getColorType(cellColor) {
  if (isColorMatch(cellColor, CONFIG.COLORS.RED)) return "RED";
  if (isColorMatch(cellColor, CONFIG.COLORS.GREEN)) return "GREEN";
  if (isColorMatch(cellColor, CONFIG.COLORS.CYAN)) return "CYAN";
  if (isColorMatch(cellColor, CONFIG.COLORS.ORANGE)) return "ORANGE";
  return "DEFAULT";
}

function getCaptainAndChip(cellValue, colorType) {
  switch (colorType) {
    case "RED":
      return { captainId: null, chip: null };
    case "GREEN":
      return { captainId: null, chip: "AUTOCAPTAIN" };
    case "CYAN":
      return {
        captainId: cellValue ? parseInt(cellValue) : null,
        chip: "FREEHIT",
      };
    case "ORANGE":
      return {
        captainId: cellValue ? parseInt(cellValue) : null,
        chip: "TRIPLECAPTAIN",
      };
    default:
      return { captainId: cellValue ? parseInt(cellValue) : null, chip: null };
  }
}

// ============== DEBUG HELPER ==============
function debugColors() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const backgrounds = sheet.getDataRange().getBackgrounds();

  const uniqueColors = new Set();
  for (let row of backgrounds) {
    for (let color of row) {
      if (color && color !== "#ffffff") {
        uniqueColors.add(color);
      }
    }
  }

  Logger.log("=== UNIQUE COLORS IN YOUR SHEET ===");
  Logger.log(Array.from(uniqueColors).join("\n"));
  Logger.log("===================================");
  Logger.log("Update CONFIG.COLORS with your exact hex codes");
}

// ============== MOCK EXPORT (NO API CALLS) ==============
function mockExportCaptaincyForGameweek() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const backgrounds = sheet.getDataRange().getBackgrounds();

  // Column index for the gameweek (C=2 for GW1, D=3 for GW2, etc.)
  const columnIndex = CONFIG.GAMEWEEK + 1;

  Logger.log(`\n${"=".repeat(50)}`);
  Logger.log(`MOCK EXPORT - GAMEWEEK ${CONFIG.GAMEWEEK}`);
  Logger.log(`${"=".repeat(50)}\n`);

  const results = {
    total: 0,
    red: 0,
    green: 0,
    cyan: 0,
    orange: 0,
    default: 0,
  };

  // Skip header row (i=0)
  for (let i = 1; i < data.length; i++) {
    const teamName = data[i][0];
    const teamId = data[i][1];
    const cellValue = data[i][columnIndex];
    const cellColor = backgrounds[i][columnIndex];

    if (!teamId) continue; // Skip rows without team ID

    results.total++;

    const colorType = getColorType(cellColor);
    const { captainId, chip } = getCaptainAndChip(cellValue, colorType);

    // Track stats
    results[colorType.toLowerCase()]++;

    // Build the payload that would be sent to API
    const payload = {
      gameweek: CONFIG.GAMEWEEK,
      captianId: captainId, // Note: typo matches your API
      chip: chip,
    };

    Logger.log(`[${colorType.padEnd(7)}] Team: ${teamName} (ID: ${teamId})`);
    Logger.log(
      `         Cell Value: ${cellValue || "(empty)"} | Color: ${cellColor}`
    );
    Logger.log(`         → Would send: ${JSON.stringify(payload)}`);
    Logger.log(`         → Endpoint: PUT ${CONFIG.API_URL}/${teamId}/gameweek`);
    Logger.log("");
  }

  Logger.log(`\n${"=".repeat(50)}`);
  Logger.log("SUMMARY");
  Logger.log(`${"=".repeat(50)}`);
  Logger.log(`Total teams processed: ${results.total}`);
  Logger.log(`  🔴 RED (null captain):      ${results.red}`);
  Logger.log(`  🟢 GREEN (AUTOCAPTAIN):     ${results.green}`);
  Logger.log(`  🔵 CYAN (FREEHIT):          ${results.cyan}`);
  Logger.log(`  🟠 ORANGE (TRIPLECAPTAIN):  ${results.orange}`);
  Logger.log(`  ⬜ DEFAULT (normal):        ${results.default}`);

  SpreadsheetApp.getUi().alert(
    `Mock Export Complete!\n\n` +
      `Check View → Logs for details.\n\n` +
      `Summary:\n` +
      `• Total: ${results.total}\n` +
      `• RED (null): ${results.red}\n` +
      `• GREEN (AUTOCAPTAIN): ${results.green}\n` +
      `• CYAN (FREEHIT): ${results.cyan}\n` +
      `• ORANGE (TRIPLECAPTAIN): ${results.orange}\n` +
      `• DEFAULT: ${results.default}`
  );
}

// ============== MENU ==============
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("FPL Tools")
    .addItem("🔍 Debug Colors", "debugColors")
    .addItem("🧪 Mock Export (Test)", "mockExportCaptaincyForGameweek")
    .addToUi();
}
