import { useMemo } from "react";
import "./GWHistoryTable.css";

function GWHistoryTable({ players, captaincies, chips, fixtures }) {
  // Get all unique gameweek IDs from player data
  const gameweeks = useMemo(() => {
    const gwSet = new Set();
    players?.forEach((player) => {
      player.gameweeks?.forEach((gw) => {
        gwSet.add(gw.gameweek_id);
      });
    });
    return Array.from(gwSet).sort((a, b) => a - b);
  }, [players]);

  // Create lookup maps for quick access
  const captaincyMap = useMemo(() => {
    const map = {};
    captaincies?.forEach((c) => {
      map[c.gameweek_id] = c.player_id;
    });
    return map;
  }, [captaincies]);

  const chipMap = useMemo(() => {
    const map = {};
    chips?.forEach((c) => {
      map[c.gameweek_id] = c.chip;
    });
    return map;
  }, [chips]);

  const fixtureMap = useMemo(() => {
    const map = {};
    fixtures?.forEach((f) => {
      map[f.gameweek_id] = f;
    });
    return map;
  }, [fixtures]);

  // Get player points for a specific gameweek
  const getPlayerGWData = (player, gwId) => {
    return player.gameweeks?.find((gw) => gw.gameweek_id === gwId);
  };

  // Get effective captain ID (handles auto-captain and min-player logic)
  // Backend now stores net points, so we use points directly without subtracting transfer cost
  const getEffectiveCaptainId = (gwId) => {
    const captainId = captaincyMap[gwId];
    const chip = chipMap[gwId];

    // If captain is explicitly set and not 0, use it
    if (captainId && captainId !== 0) {
      return captainId;
    }

    // No captain selected (0 or null) - apply auto logic
    if (players && players.length > 0) {
      if (chip === "AUTOCAPTAIN") {
        // AUTOCAPTAIN: pick player with max points
        const maxPlayer = players.reduce((max, p) => {
          const pData = getPlayerGWData(p, gwId);
          const maxData = getPlayerGWData(max, gwId);
          const currentPoints = pData?.points || 0;
          const maxPoints = maxData?.points || 0;
          return currentPoints > maxPoints ? p : max;
        });
        return maxPlayer.entry_id;
      } else {
        // No chip or other chip: pick player with min points
        const minPlayer = players.reduce((min, p) => {
          const pData = getPlayerGWData(p, gwId);
          const minData = getPlayerGWData(min, gwId);
          const currentPoints = pData?.points || 0;
          const minPoints = minData?.points || 0;
          return currentPoints < minPoints ? p : min;
        });
        return minPlayer.entry_id;
      }
    }

    return null;
  };

  // Calculate total team points for a gameweek
  // Backend now stores net points (after transfer cost), so we don't subtract again
  const calculateGWTotal = (gwId) => {
    let total = 0;
    const effectiveCaptainId = getEffectiveCaptainId(gwId);
    const chip = chipMap[gwId];
    const isTripleCaptain = chip === "TRIPLECAPTAIN";

    players?.forEach((player) => {
      const gwData = getPlayerGWData(player, gwId);
      if (gwData) {
        let points = gwData.points;

        // Apply captain multiplier
        if (player.entry_id === effectiveCaptainId) {
          points *= isTripleCaptain ? 3 : 2;
        }

        total += points;
      }
    });

    return total;
  };

  // Get result badge class
  const getResultClass = (result) => {
    switch (result) {
      case "W":
        return "result-win";
      case "L":
        return "result-loss";
      case "D":
        return "result-draw";
      default:
        return "";
    }
  };

  // Get chip display name
  const getChipDisplay = (chip) => {
    switch (chip) {
      case "TRIPLECAPTAIN":
        return "3C";
      case "AUTOCAPTAIN":
        return "AC";
      case "FREEHIT":
        return "FH";
      default:
        return "-";
    }
  };

  if (!players || players.length === 0) {
    return <div className="no-data">No player data available</div>;
  }

  return (
    <div className="gw-history-table-container">
      <table className="gw-history-table">
        <thead>
          <tr>
            <th className="sticky-col">GW</th>
            {players.map((player) => (
              <th key={player.entry_id} className="player-header">
                {player.player_name || `${player.name}`}
              </th>
            ))}
            <th>Total</th>
            <th>Chip</th>
            <th>Opponent</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {gameweeks.map((gwId) => {
            const fixture = fixtureMap[gwId];
            const chip = chipMap[gwId];
            const effectiveCaptainId = getEffectiveCaptainId(gwId);
            const total = calculateGWTotal(gwId);
            const isFreeHit = chip === "FREEHIT";

            return (
              <tr key={gwId}>
                <td className="gw-number">GW{gwId}</td>
                {players.map((player) => {
                  const gwData = getPlayerGWData(player, gwId);
                  const isCaptain = player.entry_id === effectiveCaptainId;
                  const points = gwData?.points ?? "-";
                  const transferCost = gwData?.transfers_cost || 0;
                  const hasTransferCost = !isFreeHit && transferCost > 0;

                  return (
                    <td
                      key={player.entry_id}
                      className={`player-points ${isCaptain ? "captain" : ""} ${
                        hasTransferCost ? "has-cost" : ""
                      }`}
                    >
                      <span className="points-value">
                        {points !== "-" ? points + transferCost : "-"}
                      </span>
                      {hasTransferCost && (
                        <span className="transfer-cost">-{transferCost}</span>
                      )}
                      {isCaptain && <span className="captain-badge">C</span>}
                    </td>
                  );
                })}
                <td className="total-points">{total}</td>
                <td className={`chip ${chip ? "chip-used" : ""}`}>
                  {getChipDisplay(chip)}
                </td>
                <td className="opponent">
                  {fixture?.opponent?.name || "-"}
                  {fixture && (
                    <span className="home-away">
                      {fixture.isHome ? "(H)" : "(A)"}
                    </span>
                  )}
                </td>
                <td className={`result ${getResultClass(fixture?.result)}`}>
                  {fixture?.result || "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default GWHistoryTable;
