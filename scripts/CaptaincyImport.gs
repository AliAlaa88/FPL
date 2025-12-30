/**
 * FPL Captaincy Import - PRODUCTION VERSION
 * Use this to actually send data to your database via API
 *
 * Instructions:
 * 1. First test with MockCaptaincyImport.gs to verify logic
 * 2. Update CONFIG with your production API URL
 * 3. Run exportCaptaincyForGameweek() when ready
 */

// ============== CONFIGURATION ==============
const CONFIG = {
  GAMEWEEK: 16, // <-- Change this to your target gameweek
  API_URL: "http://localhost:3000/api/teams", // <-- Your API base URL

  // Color definitions (run debugColors() in mock script to find your exact hex codes)
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

// ============== PRODUCTION EXPORT ==============
function exportCaptaincyForGameweek() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const backgrounds = sheet.getDataRange().getBackgrounds();

  // Column index for the gameweek (C=2 for GW1, D=3 for GW2, etc.)
  const columnIndex = CONFIG.GAMEWEEK + 1;

  const results = {
    success: 0,
    skipped: 0,
    errors: [],
  };

  // Skip header row (i=0)
  for (let i = 1; i < data.length; i++) {
    const teamName = data[i][0];
    const teamId = data[i][1];
    const cellValue = data[i][columnIndex];
    const cellColor = backgrounds[i][columnIndex];

    if (!teamId) {
      results.skipped++;
      continue;
    }

    const colorType = getColorType(cellColor);
    const { captainId, chip } = getCaptainAndChip(cellValue, colorType);

    // Build the payload
    const payload = {
      gameweek: CONFIG.GAMEWEEK,
      captianId: captainId, // Note: typo matches your API
      chip: chip,
    };

    try {
      const response = UrlFetchApp.fetch(
        `${CONFIG.API_URL}/${teamId}/gameweek`,
        {
          method: "put",
          contentType: "application/json",
          payload: JSON.stringify(payload),
          muteHttpExceptions: true,
        }
      );

      const responseCode = response.getResponseCode();

      if (responseCode === 200 || responseCode === 201) {
        results.success++;
        Logger.log(`✅ Team ${teamName} (${teamId}): Updated successfully`);
      } else {
        results.errors.push({
          team: teamName,
          teamId: teamId,
          status: responseCode,
          error: response.getContentText(),
        });
        Logger.log(`❌ Team ${teamName} (${teamId}): HTTP ${responseCode}`);
      }
    } catch (e) {
      results.errors.push({
        team: teamName,
        teamId: teamId,
        error: e.message,
      });
      Logger.log(`❌ Team ${teamName} (${teamId}): ${e.message}`);
    }
  }

  // Log errors
  if (results.errors.length > 0) {
    Logger.log("\n=== ERRORS ===");
    results.errors.forEach((err) => {
      Logger.log(`Team: ${err.team} (${err.teamId}) - ${err.error}`);
    });
  }

  SpreadsheetApp.getUi().alert(
    `Export Complete for GW${CONFIG.GAMEWEEK}!\n\n` +
      `✅ Success: ${results.success}\n` +
      `⏭️ Skipped: ${results.skipped}\n` +
      `❌ Errors: ${results.errors.length}\n\n` +
      (results.errors.length > 0 ? "Check View → Logs for error details." : "")
  );
}

// ============== MENU ==============
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("FPL Tools")
    .addItem("🚀 Export to Database", "exportCaptaincyForGameweek")
    .addToUi();
}
