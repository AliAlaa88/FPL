import React, { useEffect, useState } from "react";
import "./FixtureList.css";
import FixtureCard from "./FixtureCard";

function FixtureList({ currentGameWeek }) {
  const [fixtures, setFixtures] = useState([]);

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        const response = await fetch(
          `/api/fixtures/gameweek/${currentGameWeek}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch fixtures");
        }
        const fixturesData = await response.json();
        setFixtures(fixturesData || []);
        console.log("Fetched fixtures:", fixturesData);
      } catch (err) {
        console.error("Error fetching fixtures:", err);
      }
    };

    fetchFixtures();
  }, [currentGameWeek]);

  return (
    <div className="fixtureList">
      <h2>Fixtures</h2>
      <div className="fixtures-container">
        {fixtures.map((fixture, index) => (
          <FixtureCard
            key={fixture.id || index}
            homeTeam={fixture.homeTeam?.name}
            awayTeam={fixture.awayTeam?.name}
            homeTeamId={fixture.home_team_id || fixture.homeTeam?.id}
            awayTeamId={fixture.away_team_id || fixture.awayTeam?.id}
            homePoints={fixture.home_points}
            awayPoints={fixture.away_points}
            gameweek={fixture.gameweek?.week_number || currentGameWeek}
          />
        ))}
      </div>
    </div>
  );
}

export default FixtureList;
