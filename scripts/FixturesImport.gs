const cnfg = {
  API_URL: "https://uneffete-markita-buzzardlike.ngrok-free.dev/api/fixtures",
  GAMEWEEK: 19,
  NUM_FIXTURES: 10,
};

function mapTeamId(id) {
  const teamId = Number(id) | 0;
  return teamId === 2587078 ? 558155 : teamId;
}

function exportFixtures() {
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Fixtures");
  const data = sheet.getDataRange().getValues();

  // Find row for target gameweek
  let row = data[cnfg.GAMEWEEK];

  if (!row) {
    Logger.log("Gameweek not found");
    return;
  }

  // Extract fixtures
  const fixtures = [];
  for (let i = 0; i < cnfg.NUM_FIXTURES; i++) {
    const home = row[1 + i * 2];
    const away = row[2 + i * 2];
    if (home && away) {
      fixtures.push({
        gameweek_id: cnfg.GAMEWEEK,
        home_team_id: mapTeamId(home),
        away_team_id: mapTeamId(away),
      });
    }
  }
  Logger.log(JSON.stringify(fixtures));
  // Send to API
  const response = UrlFetchApp.fetch(`${cnfg.API_URL}/bulk`, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(fixtures),
  });

  Logger.log(`Status: ${response.getResponseCode()}`);
  Logger.log(`Created ${fixtures.length} fixtures for GW${cnfg.GAMEWEEK}`);
}
