/**
 * FPL Fixtures Import - PRODUCTION VERSION
 * Reads fixture data from Google Sheet and sends to database via API
 *
 * Sheet Format:
 * Row 1: Headers (Gameweek | Fix1 Home | Fix1 Away | Fix2 Home | Fix2 Away | ... | Fix10 Home | Fix10 Away)
 * Row 2+: Data (GW1 | teamId | teamId | teamId | teamId | ... )
 *
 * Instructions:
 * 1. Update CONFIG with your API URL (use ngrok for localhost)
 * 2. Run exportAllFixtures() to send all fixtures to database
 * 3. Or run exportFixturesForGameweek() for a specific gameweek
 */

// ============== CONFIGURATION ==============
const FIXTURES_CONFIG = {
  API_URL: "https://uneffete-markita-buzzardlike.ngrok-free.dev/api/fixtures", // <-- Your API URL (use ngrok for localhost)
  NUM_FIXTURES_PER_GW: 10, // Number of fixtures per gameweek
  START_ROW: 2, // First data row (after header)
  GAMEWEEK_COL: 0, // Column A = Gameweek label
};

// ============== HELPER FUNCTIONS ==============

/**
 * Parse gameweek number from cell value (e.g., "GW1" -> 1)
 */
function parseGameweekNumber(gwCell) {
  if (!gwCell) return null;
  const match = String(gwCell).match(/GW(\d+)/i);
  return match ? Number(match[1]) | 0 : null;
}

/**
 * Extract fixtures from a single row
 * Returns array of fixture objects for that gameweek
 */
function extractFixturesFromRow(row, gameweekId) {
  const fixtures = [];

  // Each fixture takes 2 columns (home, away), starting from column B (index 1)
  for (let i = 0; i < FIXTURES_CONFIG.NUM_FIXTURES_PER_GW; i++) {
    const homeColIndex = 1 + i * 2; // Fix1 Home = 1, Fix2 Home = 3, etc.
    const awayColIndex = homeColIndex + 1;

    const homeTeamId = row[homeColIndex];
    const awayTeamId = row[awayColIndex];

    // Skip if either team ID is missing or empty
    if (!homeTeamId || !awayTeamId) {
      Logger.log(
        `⚠️ GW${gameweekId} Fixture ${i + 1}: Skipping (missing team ID)`
      );
      continue;
    }

    fixtures.push({
      gameweek_id: gameweekId | 0,
      home_team_id: Number(homeTeamId) | 0,
      away_team_id: Number(awayTeamId) | 0,
    });
  }

  return fixtures;
}

// ============== EXPORT FUNCTIONS ==============

/**
 * Export all fixtures from the sheet to the database
 */
function exportAllFixtures() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getDataRange().getValues();

  const allFixtures = [];
  const results = {
    gameweeks: 0,
    fixtures: 0,
    skipped: 0,
    errors: [],
  };

  // Skip header row (i=0), process all data rows
  for (let i = FIXTURES_CONFIG.START_ROW - 1; i < 19; i++) {
    const row = data[i];
    const gameweekId = parseGameweekNumber(row[FIXTURES_CONFIG.GAMEWEEK_COL]);

    if (!gameweekId) {
      results.skipped++;
      continue;
    }

    const fixtures = extractFixturesFromRow(row, gameweekId);
    allFixtures.push(...fixtures);
    results.gameweeks++;
    Logger.log(fixtures);

    Logger.log(`📅 GW${gameweekId}: Extracted ${fixtures.length} fixtures`);
  }

  if (allFixtures.length === 0) {
    SpreadsheetApp.getUi().alert("No fixtures found to export!");
    return;
  }
  // Log the actual JSON to verify integers
  const jsonPayload = JSON.stringify(allFixtures);

  // Send all fixtures in a single bulk request
  try {
    const response = UrlFetchApp.fetch(`${FIXTURES_CONFIG.API_URL}/bulk`, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(allFixtures),
      muteHttpExceptions: true,
    });

    const responseCode = response.getResponseCode();
    const responseBody = response.getContentText();

    if (responseCode === 200 || responseCode === 201) {
      results.fixtures = allFixtures.length;
      Logger.log(`✅ Successfully created ${allFixtures.length} fixtures`);
    } else {
      results.errors.push({
        status: responseCode,
        error: responseBody,
      });
      Logger.log(`❌ Bulk create failed: HTTP ${responseCode}`);
      Logger.log(responseBody);
    }
  } catch (e) {
    results.errors.push({ error: e.message });
    Logger.log(`❌ Error: ${e.message}`);
  }

  // Show summary
  SpreadsheetApp.getUi().alert(
    `Fixtures Export Complete!\n\n` +
      `📅 Gameweeks processed: ${results.gameweeks}\n` +
      `✅ Fixtures created: ${results.fixtures}\n` +
      `⏭️ Rows skipped: ${results.skipped}\n` +
      `❌ Errors: ${results.errors.length}\n\n` +
      (results.errors.length > 0 ? "Check View → Logs for error details." : "")
  );
}

/**
 * Export fixtures for a specific gameweek only
 */
function exportFixturesForGameweek() {
  const ui = SpreadsheetApp.getUi();

  // Prompt for gameweek number
  const response = ui.prompt(
    "Export Fixtures",
    "Enter the gameweek number (e.g., 1 for GW1):",
    ui.ButtonSet.OK_CANCEL
  );

  if (response.getSelectedButton() !== ui.Button.OK) {
    return;
  }

  const targetGW = parseInt(response.getResponseText());
  if (isNaN(targetGW) || targetGW < 1) {
    ui.alert("Invalid gameweek number!");
    return;
  }

  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getDataRange().getValues();

  // Find the row for the target gameweek
  let targetRow = null;
  for (let i = FIXTURES_CONFIG.START_ROW - 1; i < data.length; i++) {
    const gwNum = parseGameweekNumber(data[i][FIXTURES_CONFIG.GAMEWEEK_COL]);
    if (gwNum === targetGW) {
      targetRow = data[i];
      break;
    }
  }

  if (!targetRow) {
    ui.alert(`Gameweek ${targetGW} not found in the sheet!`);
    return;
  }

  const fixtures = extractFixturesFromRow(targetRow, targetGW);

  if (fixtures.length === 0) {
    ui.alert(`No valid fixtures found for GW${targetGW}!`);
    return;
  }

  // Send fixtures
  try {
    const response = UrlFetchApp.fetch(`${FIXTURES_CONFIG.API_URL}/bulk`, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(fixtures),
      muteHttpExceptions: true,
    });

    const responseCode = response.getResponseCode();

    if (responseCode === 200 || responseCode === 201) {
      Logger.log(`✅ GW${targetGW}: Created ${fixtures.length} fixtures`);
      ui.alert(
        `Success!\n\nCreated ${fixtures.length} fixtures for GW${targetGW}.`
      );
    } else {
      Logger.log(`❌ GW${targetGW}: HTTP ${responseCode}`);
      Logger.log(response.getContentText());
      ui.alert(
        `Error creating fixtures for GW${targetGW}.\n\nHTTP ${responseCode}\n\nCheck View → Logs for details.`
      );
    }
  } catch (e) {
    Logger.log(`❌ Error: ${e.message}`);
    ui.alert(`Error: ${e.message}`);
  }
}

/**
 * Preview fixtures without sending to database (for testing)
 */
function previewFixtures() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getDataRange().getValues();

  let totalFixtures = 0;

  Logger.log("=== FIXTURES PREVIEW ===\n");

  for (let i = FIXTURES_CONFIG.START_ROW - 1; i < data.length; i++) {
    const row = data[i];
    const gameweekId = parseGameweekNumber(row[FIXTURES_CONFIG.GAMEWEEK_COL]);

    if (!gameweekId) continue;

    const fixtures = extractFixturesFromRow(row, gameweekId);
    totalFixtures += fixtures.length;

    Logger.log(`\n📅 GW${gameweekId} (${fixtures.length} fixtures):`);
    fixtures.forEach((f, idx) => {
      Logger.log(`  ${idx + 1}. ${f.home_team_id} vs ${f.away_team_id}`);
    });
  }

  Logger.log(`\n=== TOTAL: ${totalFixtures} fixtures ===`);

  SpreadsheetApp.getUi().alert(
    `Preview Complete!\n\nFound ${totalFixtures} fixtures.\n\nCheck View → Logs for details.`
  );
}

// ============== MENU ==============
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("FPL Fixtures")
    .addItem("📋 Preview Fixtures", "previewFixtures")
    .addItem("🚀 Export All Fixtures", "exportAllFixtures")
    .addItem("📅 Export Single Gameweek", "exportFixturesForGameweek")
    .addToUi();
}
