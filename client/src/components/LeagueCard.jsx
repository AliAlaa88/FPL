import { useState , useEffect } from "react";
import { useLeagues } from "../context/leaguesContext";
import PlayerCard from "./PlayerCard";
import "./LeagueCard.css";
import tripleIcon from "/triple-captain-chip.webp";

function LeagueCard({ team }) {
  // team.chip="triplecaptain";
  // team.captain_id=team.players[0]?.entry_id;
  const [selected, setSelected] = useState(team.captain_id || null);
  const [selectedChip, setSelectedChip] = useState(team.chip || null);
  const [totalPoints, setTotalPoints] = useState(0);
  const { setTeamTotalPoints } = useLeagues();

  useEffect(() => {
    const initialTotal = team.players.reduce(
      (sum, p) =>
        sum +
        (p.gameweeks[0].points - p.gameweeks[0].transfers_cost) *
          (1 + +(selected === p.entry_id) * (1 + +(selectedChip === "triplecaptain"))),
      0
    );
    setTotalPoints(initialTotal);
    
    // Store total points in context with team ID
    setTeamTotalPoints(prev => ({
      ...prev,
      [team.id]: initialTotal
    }));
  }, [team.players, selected, selectedChip, team.id, setTeamTotalPoints]);

  const handleSelectPlayer = (playerId) => {
    if (team.captain_id) return; // Prevent changing captain if already submitted

    const newSelected = selected === playerId ? null : playerId;
    setSelected(newSelected);

    const newTotal = team.players.reduce(
      (sum, p) =>
        sum +
        p.gameweeks[0].points *
          (1 + +(newSelected === p.entry_id) * (1 + +(selectedChip === "triplecaptain"))),
      0
    );
    setTotalPoints(newTotal);
    
    // Update total points in context
    setTeamTotalPoints(prev => ({
      ...prev,
      [team.id]: newTotal
    }));
  };

  const handleChipSelection = (chip) => {
    if (team.chip) return; // Prevent changing chip if already submitted
    
    const newChip = selectedChip === chip ? null : chip;
    setSelectedChip(newChip);
    
    // Recalculate total points with new chip
    const newTotal = team.players.reduce(
      (sum, p) =>
        sum +
        p.gameweeks[0].points *
          (1 + +(selected === p.entry_id) * (1 + +(newChip === "triplecaptain"))),
      0
    );
    setTotalPoints(newTotal);
    
    // Update total points in context
    setTeamTotalPoints(prev => ({
      ...prev,
      [team.id]: newTotal
    }));
  };

  return (
    <div className="league-card small">
      {team && (
        <>
          <div className="league-header">
            <button 
              className={selectedChip === "triplecaptain" ? "chip active" : "chip"}
              onClick={() => handleChipSelection("triplecaptain")}
              disabled={!!team.chip}
            >
              <img src={tripleIcon} alt="Triple Captain Chip" width={50}/>
            </button>
            <button 
              className={selectedChip === "autocaptain" ? "chip active" : "chip"}
              onClick={() => handleChipSelection("autocaptain")}
              disabled={!!team.captain_id}
            >
              <img src={tripleIcon} alt="Auto Captain Chip" width={50}/>
            </button>
            <button 
              className={selectedChip === "freehit" ? "chip active" : "chip"}
              onClick={() => handleChipSelection("freehit")}
              disabled={!!team.captain_id}
            >
              <img src={tripleIcon} alt="Free Hit Chip" width={50}/>
            </button>
            <button>
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
                  +(selected === player.entry_id) * (1 + +(selectedChip === "triplecaptain"))
                }
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default LeagueCard;
