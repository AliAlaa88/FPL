import React, { useEffect, useState } from "react";
import { useLeagues } from "../context/leaguesContext";
import "./FixtureList.css";
import FixtureCard from "./FixtureCard";

function FixtureList() {
  const { leagues } = useLeagues();
  const [fixtures, setFixtures] = useState([]);
  const [league1, setLeague1] = useState("");
  const [league2, setLeague2] = useState("");

  const handleAddFixture = () => {
    if (league1 && league2 && league1 !== league2) {
      setFixtures([
        ...fixtures,
        {
          id: Date.now(), // Add unique id for better tracking
          league1Id: league1,
          league2Id: league2,
        },
      ]);
      setLeague1("");
      setLeague2("");
    }
  };

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

  return (
    <div className="fixtureList">
      <h2>Fixtures List</h2>
      <div className="fixtures-controls">
        <select value={league1} onChange={(e) => setLeague1(e.target.value)}>
          <option value="">Select League 1</option>
          {leagues.map((league) => (
            <option key={league.id} value={league.id}>
              {league.name}
            </option>
          ))}
        </select>
        <span>vs</span>
        <select value={league2} onChange={(e) => setLeague2(e.target.value)}>
          <option value="">Select League 2</option>
          {leagues.map((league) => (
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
            />
          );
        })}
      </div>
    </div>
  );
}

export default FixtureList;
