import React, { useEffect, useState, useCallback } from "react";
import { useLeagues } from "../context/leaguesContext";
import "./FixtureList.css";
import FixtureCard from "./FixtureCard";

function FixtureList() {
  const { leagues, setLeagues, leaguePoints, setLeaguePoints } = useLeagues();
  const [fixtures, setFixtures] = useState([]);
  const [league1, setLeague1] = useState("");
  const [league2, setLeague2] = useState("");

  // Get leagues that are already used in fixtures
  const getUsedLeagues = () => {
    const used = new Set();
    fixtures.forEach(fixture => {
      used.add(fixture.league1Id);
      used.add(fixture.league2Id);
    });
    return used;
  };

  // Get available leagues for selection
  const getAvailableLeagues = (excludeId = null) => {
    const usedLeagues = getUsedLeagues();
    return leagues.filter(league => {
      const leagueId = league.id.toString();
      return !usedLeagues.has(leagueId) || leagueId === excludeId;
    });
  };

  const handleAddFixture = () => {
    if (league1 && league2 && league1 !== league2) {
      setFixtures([
        ...fixtures,
        {
          id: Date.now(),
          league1Id: league1,
          league2Id: league2,
        },
      ]);
      setLeague1("");
      setLeague2("");
    }
  };

  const handleStandingChange = useCallback((league1Name, league1LeaguePoints, leage1TotalPoints, league2Name, league2LeaguePoints, leage2TotalPoints) => {
    setLeaguePoints((prevPoints) => {
      console.log('Previous League Points:', prevPoints[league1Name]?.basePoints, prevPoints[league2Name]?.basePoints);
      return {
        ...prevPoints,
        [league1Name]: {
          ...prevPoints[league1Name],
          liveLeaguePoints: (prevPoints[league1Name]?.baseLeaguePoints || 0) + league1LeaguePoints,
          liveTotalPoints: (prevPoints[league1Name]?.baseTotalPoints || 0) + leage1TotalPoints
        },
        [league2Name]: {
          ...prevPoints[league2Name],
          liveLeaguePoints: (prevPoints[league2Name]?.baseLeaguePoints || 0) + league2LeaguePoints,
          liveTotalPoints: (prevPoints[league2Name]?.baseTotalPoints || 0) + leage2TotalPoints
        }
      };
    });
  }, [setLeaguePoints]);

  // Update fixtures when leagues change
  useEffect(() => {
    setFixtures((prevFixtures) =>
      prevFixtures.filter(
        (fixture) =>
          leagues.some((l) => l.id.toString() === fixture.league1Id) &&
          leagues.some((l) => l.id.toString() === fixture.league2Id)
      )
    );
  }, [leagues]);

  // Get current league data for rendering
  const getFixtureData = (fixture) => {
    const league1Data = leagues.find(
      (l) => l.id.toString() === fixture.league1Id
    );
    const league2Data = leagues.find(
      (l) => l.id.toString() === fixture.league2Id
    );

    return {
      league1: league1Data,
      league2: league2Data,
    };
  };

  const availableLeagues = getAvailableLeagues(league2);

  return (
    <div className="fixtureList">
      <h2>Fixtures List</h2>
      <div className="fixtures-controls">
        <select value={league1} onChange={(e) => setLeague1(e.target.value)}>
          <option value="">Select League 1</option>
          {availableLeagues.map((league) => (
            <option key={league.id} value={league.id}>
              {league.name}
            </option>
          ))}
        </select>
        <span>vs</span>
        <select value={league2} onChange={(e) => setLeague2(e.target.value)}>
          <option value="">Select League 2</option>
          {availableLeagues.map((league) => (
            <option key={league.id} value={league.id}>
              {league.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddFixture}
          disabled={!league1 || !league2 || league1 === league2}
        >
          Add Fixture
        </button>
      </div>
      <div className="fixtures-container">
        {fixtures.map((fixture) => {
          const fixtureData = getFixtureData(fixture);
          if (!fixtureData.league1 || !fixtureData.league2) return null;

          return (
            <FixtureCard
              league1={fixtureData.league1.name}
              league2={fixtureData.league2.name}
              league1Points={fixtureData.league1.totalPoints}
              league2Points={fixtureData.league2.totalPoints}
              key={fixture.id}
              handleStandingChange={handleStandingChange}
            />
          );
        })}
      </div>
    </div>
  );
}

export default FixtureList;
