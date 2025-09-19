import { useEffect, useState } from "react";
import "./Standing.css";

const Standing = ({ currentGameWeek }) => {
  const [standings, setStandings] = useState([]);

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const response = await fetch(`/api/standings?gameweek=${currentGameWeek}`);
        if (!response.ok) {
          throw new Error('Failed to fetch standings');
        }
        const standingsData = await response.json();
        setStandings(standingsData || []);
        console.log("Fetched standings:", standingsData);
      } catch (err) {
        console.error('Error fetching standings:', err);
      }
    };

    fetchStandings();
  }, [currentGameWeek]);

  return (
    <div className="standings-container">
      <h2>League Standings</h2>
      <div className="standings-table">
        <div className="standings-header">
          <div className="position">Pos</div>
          <div className="team-name">Team</div>
          <div className="points">Pts</div>
          <div className="goals">GF</div>
          <div className="goals">GA</div>
          <div className="goals">GD</div>
        </div>
        {standings.map((team, index) => {
          const goalDifference = parseInt(team.goals_for) - parseInt(team.goals_against);
          return (
            <div key={team.team_id} className="standings-row">
              <div className="position">{index + 1}</div>
              <div className="team-name">{team.name}</div>
              <div className="points">{team.league_points}</div>
              <div className="goals">{team.goals_for}</div>
              <div className="goals">{team.goals_against}</div>
              <div className={`goals ${goalDifference >= 0 ? 'positive' : 'negative'}`}>
                {goalDifference > 0 ? '+' : ''}{goalDifference}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Standing;
