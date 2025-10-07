import { useState, useEffect } from "react";
import { useLeagues } from "../context/leaguesContext";
import PlayerCard from "./PlayerCard";
import "./LeagueCard.css";
import tripleCaptainIcon from "/triple-captain-chip.webp";
import autoCaptainIcon from "/auto-captain-chip.webp";
import freeHitIcon from "/free-hit-chip.webp";

function LeagueCard({ team, currentGameWeek }) {
  // team?.chips[0]?.chip="AUTOCAPTAIN";
  // team?.captaincies[0]?.player_id=team.players[0]?.entry_id;
  // team?.captaincies[0]?.player_id=0;

  const [selected, setSelected] = useState(
    team?.captaincies[0]?.player_id || null
  );
  const [selectedChip, setSelectedChip] = useState(
    team?.chips[0]?.chip || "NONE"
  );
  const [totalPoints, setTotalPoints] = useState(0);
  const { setTeamTotalPoints } = useLeagues();

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
            const currentPoints = p.gameweeks[0].points - p.gameweeks[0].transfers_cost;
            const maxPoints = max.gameweeks[0].points - max.gameweeks[0].transfers_cost;
            return currentPoints > maxPoints ? p : max;
          });
          setSelected(maxPlayer.entry_id);
        }
      } else {
        if (team.players.length > 0) {
          const minPlayer = team.players.reduce((min, p) => {
            const currentPoints = p.gameweeks[0].points - p.gameweeks[0].transfers_cost;
            const minPoints = min.gameweeks[0].points - min.gameweeks[0].transfers_cost;
            return currentPoints < minPoints ? p : min;
          });
          setSelected(minPlayer.entry_id);
        }
      }
    }
  }, [team, currentGameWeek]);

  // Calculate total points (can be derived state)
  useEffect(() => {
    if (!team) return;
    
    const initialTotal = team.players.reduce(
      (sum, p) =>
        sum +
        (p.gameweeks[0].points -
          +(team?.chips[0]?.chip !== "FREEHIT") * p.gameweeks[0].transfers_cost) *
          (1 + +(selected === p.entry_id) * (1 + +(selectedChip === "TRIPLECAPTAIN"))),
      0
    );
    setTotalPoints(initialTotal);
    setTeamTotalPoints((prev) => ({
      ...prev,
      [team.id]: initialTotal,
    }));
  }, [team, selected, selectedChip, setTeamTotalPoints]);

  const handleSelectPlayer = (playerId) => {
    if ((team?.captaincies[0]?.player_id || null) !== null) return; // Prevent changing captain if already submitted
    const newSelected = selected === playerId ? null : playerId;
    setSelected(newSelected);

    const newTotal = team.players.reduce(
      (sum, p) =>
        sum +
        (p.gameweeks[0].points -
          +(team?.chips[0]?.chip !== "FREEHIT") *
            p.gameweeks[0].transfers_cost) *
          (1 +
            +(newSelected === p.entry_id) *
              (1 + +(selectedChip === "TRIPLECAPTAIN"))),
      0
    );
    setTotalPoints(newTotal);
    // Update total points in context
    setTeamTotalPoints((prev) => ({
      ...prev,
      [team.id]: newTotal,
    }));
  };

  const handleChipSelection = (chip) => {
    if (team?.chips[0]?.chip) return; // Prevent changing chip if already submitted

    const newChip = selectedChip === chip ? "NONE" : chip;
    setSelectedChip(newChip);

    // Recalculate total points with new chip
    const newTotal = team.players.reduce(
      (sum, p) =>
        sum +
        (p.gameweeks[0].points -
          +(team?.chips[0]?.chip !== "FREEHIT") *
            p.gameweeks[0].transfers_cost) *
          (1 +
            +(selected === p.entry_id) * (1 + +(newChip === "TRIPLECAPTAIN"))),
      0
    );
    setTotalPoints(newTotal);
    // Update total points in context
    setTeamTotalPoints((prev) => ({
      ...prev,
      [team.id]: newTotal,
    }));
  };

  const handleSubmit = async () => {
    try {
      console.log(
        "Submitting: ",
        JSON.stringify({
          gameweek: currentGameWeek,
          ...(selected && { captianId: selected }),
          chip: selectedChip,
        })
      );
      const response = await fetch(`/api/teams/${team.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameweek: currentGameWeek,
          ...(selected && { captianId: selected }),
          chip: selectedChip,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to submit team selection");
      }

      const result = await response.json();
      console.log("Team selection submitted successfully:", result);
    } catch (error) {
      console.error("Error submitting team selection:", error);
    }
  };

  return (
    <div className="league-card small">
      {team && (
        <>
          <div className="league-header">
            <button
              className={
                selectedChip === "TRIPLECAPTAIN" ? "chip active" : "chip"
              }
              onClick={() => handleChipSelection("TRIPLECAPTAIN")}
              disabled={
                !!team?.chips[0]?.chip || team.prevChips?.some(chip => chip.chip === "TRIPLECAPTAIN")
              }
            >
              <img src={tripleCaptainIcon} alt="Triple Captain Chip" />
            </button>
            <button
              className={
                selectedChip === "AUTOCAPTAIN" ? "chip active" : "chip"
              }
              onClick={() => handleChipSelection("AUTOCAPTAIN")}
              disabled={
                !!team?.chips[0]?.chip || team.prevChips?.some(chip => chip.chip === "AUTOCAPTAIN")
              }
            >
              <img src={autoCaptainIcon} alt="Auto Captain Chip" />
            </button>
            <button
              className={selectedChip === "FREEHIT" ? "chip active" : "chip"}
              onClick={() => handleChipSelection("FREEHIT")}
              disabled={!!team?.chips[0]?.chip || team.prevChips?.some(chip => chip.chip === "FREEHIT")}
            >
              <img src={freeHitIcon} alt="Free Hit Chip" />
            </button>
            <button onClick={handleSubmit} disabled={!!team?.chips[0]?.chip}>
              Submit
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
            <span>
              Chip: <b>{selectedChip}</b>
            </span>
          </div>
          <div className="players-vertical">
            {team.players.map((player) => (
              <PlayerCard
                key={player.entry_id}
                player={player}
                selected={selected === player.entry_id}
                onSelect={() => handleSelectPlayer(player.entry_id)}
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
    </div>
  );
}

export default LeagueCard;
