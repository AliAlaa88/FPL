import { useState , useEffect } from "react";
import { useLeagues } from "../context/leaguesContext";
import PlayerCard from "./PlayerCard";
import "./LeagueCard.css";

function LeagueCard({ team }) {
  team.chip = "triple"; // Default chip if not provided
  // const { leagues, setLeagues, leaguePoints, setLeaguePoints } = useLeagues(); // for live updating points in fixtures, standings
  const [selected, setSelected] = useState(team.captain_id || null);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    const initialTotal = team.players.reduce(
      (sum, p) =>
        sum +
        p.gameweeks[0].points *
          (1 + +(selected === p.entry_id) * (1 + +(team.chip === "triple"))),
      0
    );
    setTotalPoints(initialTotal);
  }, [team.players, selected, team.chip]);

  const handleSelectPlayer = (playerId) => {
    if (team.captain_id) return; // Prevent changing captain if fetched from api -> submitted already

    const newSelected = selected === playerId ? null : playerId;
    setSelected(newSelected);

    const newTotal = team.players.reduce(
      (sum, p) =>
        sum +
        p.gameweeks[0].points *
          (1 + +(newSelected === p.entry_id) * (1 + +(team.chip === "triple"))),
      0
    );
    setTotalPoints(newTotal);

    // setLeagues((prevLeagues) => {
    //   return prevLeagues.map((l) =>
    //     l.id === data.league.id ? { ...l, totalPoints: newTotal } : l
    //   );
    // });
  };

  return (
    <div className="league-card small">
      {team && (
        <>
          <div>
            <h3 className="league-name">Chips Buttons & Submit Button</h3>
            <p>for admins only</p>
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
              Chip: <b>{team.chip[0]}</b> {/* replace by chip icon */}
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
                  +(selected === player.entry_id) * (1 + +(team.chip === "triple"))
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
