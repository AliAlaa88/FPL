import { useState, useEffect } from "react";
import LeagueCard from "./LeagueCard";
import { useLeagues } from "../context/leaguesContext";
import "./LeagueList.css";

function LeagueList({ currentGameWeek }) {
  const [teams, setTeams] = useState([]);
  const { setLeagueNames } = useLeagues();

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
        setLeagueNames((prev) => {
          const updated = { ...prev };
          teamsData.forEach((team) => {
            if (team.id && team.name) {
              updated[team.id] = team.name;
            }
          });
          return updated;
        });

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
        {teams && teams.map((team) => <LeagueCard key={team.id} team={team} currentGameWeek={currentGameWeek} />)}
      </div>
    </div>
  );
}

export default LeagueList;
