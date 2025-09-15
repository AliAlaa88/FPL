import React, { useEffect, useState, useCallback } from "react";
import "./FixtureList.css";
import FixtureCard from "./FixtureCard";

function FixtureList({ currentGameWeek }) {
  const [fixtures, setFixtures] = useState([]);

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        const response = await fetch(
          `/api/fixtures/gameweek/${currentGameWeek}`
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
    <div className="container">
      <div className="fixtureList">
        <h2>Fixtures</h2>
        <div className="fixtures-container">
          {fixtures.map((fixture) => (
            <FixtureCard
              key={fixture.id}
              homeTeam={fixture.homeTeam.name}
              awayTeam={fixture.awayTeam.name}
              homePoints={fixture.home_points}
              awayPoints={fixture.away_points}
              gameweek={fixture.gameweek.week_number}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default FixtureList;
