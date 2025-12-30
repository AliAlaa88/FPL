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

  // Calculate total team points for a gameweek
  const calculateGWTotal = (gwId) => {
    let total = 0;
    const captainId = captaincyMap[gwId];
    const chip = chipMap[gwId];
    const isFreeHit = chip === "FREEHIT";
    const isTripleCaptain = chip === "TRIPLECAPTAIN";

    players?.forEach((player) => {
      const gwData = getPlayerGWData(player, gwId);
      if (gwData) {
        let points = gwData.points;

        // Subtract transfer cost unless it's a free hit
        if (!isFreeHit) {
          points -= gwData.transfers_cost || 0;
        }

        // Apply captain multiplier
        if (player.entry_id === captainId) {
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
                {player.player_name || `Player ${player.entry_id}`}
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
            const captainId = captaincyMap[gwId];
            const total = calculateGWTotal(gwId);

            return (
              <tr key={gwId}>
                <td className="sticky-col gw-number">GW{gwId}</td>
                {players.map((player) => {
                  const gwData = getPlayerGWData(player, gwId);
                  const isCaptain = player.entry_id === captainId;
                  const points = gwData?.points ?? "-";

                  return (
                    <td
                      key={player.entry_id}
                      className={`player-points ${isCaptain ? "captain" : ""}`}
                    >
                      {points}
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
