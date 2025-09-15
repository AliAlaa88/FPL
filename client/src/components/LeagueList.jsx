import { useState, useEffect } from "react";
import LeagueCard from "./LeagueCard";
import "./LeagueList.css";

function LeagueList({ currentGameWeek }) {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      const response = await fetch(`http://localhost:3001/api/teams/with-players?gameweek=${currentGameWeek}`);
      if (!response.ok) {
        console.error('Failed to fetch teams');
        return;
      }

      const data = await response.json();
      if (!data) {
        console.error('API error:', data);
        return;
      }

      setTeams(data || []);
      console.log(data);
    };

    fetchTeams();
  }, [currentGameWeek]);

  return (
    <div className="container">
      <div className="multi-league-list">
        {teams && teams.map((team) => (
          <LeagueCard key={team.id} team={team} />
        ))}
      </div>
    </div>
  );
}

export default LeagueList;
