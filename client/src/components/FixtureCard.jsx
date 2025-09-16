import "./FixtureCard.css";
import { useLeagues } from "../context/leaguesContext";

function FixtureCard({ homeTeam, awayTeam, homeTeamId, awayTeamId, homePoints, awayPoints, gameweek }) {
  const { teamTotalPoints } = useLeagues();
  
  // Use context points if available, otherwise fallback to API points or 0
  const homeTeamPoints = teamTotalPoints[homeTeamId] || homePoints || 0;
  const awayTeamPoints = teamTotalPoints[awayTeamId] || awayPoints || 0;
  
  let winner = null;
  let result = "";
  
  if (homeTeamPoints > awayTeamPoints) {
    winner = homeTeam;
    result = "W";
  } else if (awayTeamPoints > homeTeamPoints) {
    winner = awayTeam;
    result = "W";
  } else {
    winner = "Draw";
    result = "D";
  }

  return (
    <div className="fixture-card">
      <div className="gameweek-info">
        <span>Gameweek {gameweek}</span>
      </div>
      <h3>
        {homeTeam} <b>({homeTeamPoints})</b> vs {awayTeam} <b>({awayTeamPoints})</b>
      </h3>
      <div className="result">
        Winner: <b>{winner}</b>
      </div>
    </div>
  );
}

export default FixtureCard;