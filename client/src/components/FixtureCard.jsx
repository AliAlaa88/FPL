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
      <div className="fixture-teams">
        <div className="team-vs-team">
          <div className="team-section">
            <div className="team-name">{homeTeam}</div>
            <div className="team-points">{homeTeamPoints}</div>
          </div>
          
          <div className="vs-divider">VS</div>
          
          <div className="team-section">
            <div className="team-name">{awayTeam}</div>
            <div className="team-points">{awayTeamPoints}</div>
          </div>
        </div>
      </div>
      
      <div className="result-section">
        Winner: <span className={winner !== "Draw" ? "winner" : ""}>{winner}</span>
      </div>
    </div>
  );
}

export default FixtureCard;