import { useState, useEffect } from "react";
import LeagueCard from "./LeagueCard";
import "./LeagueList.css";

function LeagueList({ currentGameWeek }) {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/teams/with-players?gameweek=${currentGameWeek}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch teams");
        }
        const teamsData = await response.json();
        setTeams(teamsData || []);
        console.log("Fetched teams:", teamsData);
      } catch (err) {
        console.error("Error fetching teams:", err);
      }
    };

    fetchTeams();
  }, [currentGameWeek]);

  return (
    <div className="container">
      <div className="multi-league-list">
        {teams && teams.map((team) => <LeagueCard key={team.id} team={team} />)}
      </div>
    </div>
  );
}

export default LeagueList;
