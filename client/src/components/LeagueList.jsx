import { useState, useEffect } from "react";
import LeagueCard from "./LeagueCard";
import "./LeagueList.css";

function LeagueList({ currentGameWeek }) {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      const response = await fetch(`http://localhost:3001/api/teams/${currentGameWeek}`);
      if (!response.ok) {
        console.error('Failed to fetch teams');
        return;
      }

      const data = await response.json();
      if (!data.success) {
        console.error('API error:', data.message);
        return;
      }

      setTeams(data.data || []);
      console.log(data.message, data.data);
    };

    fetchTeams();
  }, [currentGameWeek]);

  return (
    <div className="container">
      <div className="multi-league-list">
        {teams.map((team) => (
          <LeagueCard key={team.id} team={team} />
        ))}
      </div>
    </div>
  );
}

export default LeagueList;
