const cnfg = {
  API_URL: "https://uneffete-markita-buzzardlike.ngrok-free.dev/api/teams",
  GAMEWEEK: 19,
  COLORS: {
    RED: ["#ff0000", "#ea9999", "#e06666", "#cc0000", "#990000", "#f4cccc"],
    GREEN: ["#00ff00", "#93c47d", "#b6d7a8", "#6aa84f", "#38761d", "#d9ead3"],
    CYAN: ["#00ffff", "#76a5af", "#a2c4c9", "#45818e", "#134f5c", "#d0e0e3"],
    ORANGE: ["#ff9900", "#f6b26b", "#e69138", "#b45f06", "#783f04", "#fce5cd"],
  },
};

function getColorType(cellColor) {
  const c = cellColor.toLowerCase().trim();
  if (cnfg.COLORS.RED.includes(c)) return "RED";
  if (cnfg.COLORS.GREEN.includes(c)) return "GREEN";
  if (cnfg.COLORS.CYAN.includes(c)) return "CYAN";
  if (cnfg.COLORS.ORANGE.includes(c)) return "ORANGE";
  return "DEFAULT";
}

function getCaptainAndChip(val, color) {
  const id = val ? parseInt(val) : null;
  if (color === "RED") return { captainId: null, chip: "NONE" };
  if (color === "GREEN") return { captainId: null, chip: "AUTOCAPTAIN" };
  if (color === "CYAN") return { captainId: id, chip: "FREEHIT" };
  if (color === "ORANGE") return { captainId: id, chip: "TRIPLECAPTAIN" };
  return { captainId: id, chip: "NONE" };
}

function exportCaptaincy() {
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Cap");
  const data = sheet.getDataRange().getValues();
  const backgrounds = sheet.getDataRange().getBackgrounds();
  const col = cnfg.GAMEWEEK + 1;

  for (let i = 1; i < 21; i++) {
    const teamId = data[i][1];
    if (!teamId) continue;

    const colorType = getColorType(backgrounds[i][col]);
    const { captainId, chip } = getCaptainAndChip(data[i][col], colorType);

    const payload = {
      gameweek: cnfg.GAMEWEEK,
      captianId: captainId,
      chip: chip,
    };

    UrlFetchApp.fetch(`${cnfg.API_URL}/${teamId}/gameweek`, {
      method: "put",
      contentType: "application/json",
      payload: JSON.stringify(payload),
    });
  }

  Logger.log(`Done: GW${cnfg.GAMEWEEK}`);
}
