import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PlayerCard from "./PlayerCard";
import "./LeagueCard.css";
import tripleCaptainIcon from "/triple-captain-chip.webp";
import autoCaptainIcon from "/auto-captain-chip.webp";
import freeHitIcon from "/free-hit-chip.webp";

function LeagueCard({ team, currentGameWeek }) {
  const [selected, setSelected] = useState(
    team?.captaincies[0]?.player_id || null,
  );
  const [selectedChip, setSelectedChip] = useState(
    team?.chips[0]?.chip || "NONE",
  );
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    if (!team) return;

    // Set initial states from team data
    setSelectedChip(team?.chips[0]?.chip || "NONE");
    setSelected(team?.captaincies[0]?.player_id || null);

    // Handle auto-captain logic when captain_id is 0
    if (team?.captaincies[0]?.player_id === 0) {
      if (team?.chips[0]?.chip === "AUTOCAPTAIN") {
        if (team.players.length > 0) {
          const maxPlayer = team.players.reduce((max, p) => {
            const currentPoints = p.gameweeks[0].points;
            const maxPoints = max.gameweeks[0].points;
            return currentPoints > maxPoints ? p : max;
          });
          setSelected(maxPlayer.entry_id);
        }
      } else {
        if (team.players.length > 0) {
          const minPlayer = team.players.reduce((min, p) => {
            const currentPoints = p.gameweeks[0].points;
            const minPoints = min.gameweeks[0].points;
            return currentPoints < minPoints ? p : min;
          });
          setSelected(minPlayer.entry_id);
        }
      }
    }
  }, [team, currentGameWeek]);

  // Calculate total points - points from backend are already net (after transfer cost)
  useEffect(() => {
    if (!team) return;

    const chip = team?.chips[0]?.chip;
    const isFreeHit = chip === "FREEHIT";
    const isTripleCaptain = chip === "TRIPLECAPTAIN";

    const total = team.players.reduce((sum, p) => {
      let playerPoints = p.gameweeks[0].points;

      // If FreeHit, add back transfer cost since backend didn't deduct it
      // (backend stores net points, but FreeHit means no cost was applied)

      // Captain bonus
      if (selected === p.entry_id) {
        playerPoints *= isTripleCaptain ? 3 : 2;
      }

      return sum + playerPoints;
    }, 0);

    setTotalPoints(total);
  }, [team, selected, selectedChip]);

  return (
    <Link to={`/league/${team.id}`} className="league-card small">
      {team && (
        <>
          <div className="league-header">
            <button
              className={
                selectedChip === "TRIPLECAPTAIN" ? "chip active" : "chip"
              }
              disabled={true}
            >
              <img src={tripleCaptainIcon} alt="Triple Captain Chip" />
            </button>
            <button
              className={
                selectedChip === "AUTOCAPTAIN" ? "chip active" : "chip"
              }
              disabled={true}
            >
              <img src={autoCaptainIcon} alt="Auto Captain Chip" />
            </button>
            <button
              className={selectedChip === "FREEHIT" ? "chip active" : "chip"}
              disabled={true}
            >
              <img src={freeHitIcon} alt="Free Hit Chip" />
            </button>
          </div>
          <div className="league-info small">
            <span>
              Name: <b>{team.name}</b>
            </span>
            <span>
              ID: <b>{team.id}</b>
            </span>
            <span>
              GW Points: <b>{totalPoints}</b>
            </span>
          </div>
          <div className="players-vertical">
            {team.players.map((player) => (
              <PlayerCard
                key={player.entry_id}
                player={player}
                selected={selected === player.entry_id}
                onSelect={() => {}}
                factor={
                  1 +
                  +(selected === player.entry_id) *
                    (1 + +(selectedChip === "TRIPLECAPTAIN"))
                }
                isFreeHit={selectedChip === "FREEHIT"}
              />
            ))}
          </div>
        </>
      )}
    </Link>
  );
}

export default LeagueCard;
