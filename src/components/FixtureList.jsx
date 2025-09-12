import React, { useState } from "react";
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
          league1: leagues.find(
            (l) => (l.league?.id || l.id)?.toString() === league1
          ),
          league2: leagues.find(
            (l) => (l.league?.id || l.id)?.toString() === league2
          ),
        },
      ]);
      setLeague1("");
      setLeague2("");
    }
  };

  return (
    <div className="fixtureList">
      Fixtures List
      <div style={{ display: "flex", gap: "1rem", margin: "1rem 0" }}>
        <select value={league1} onChange={(e) => setLeague1(e.target.value)}>
          <option value="">Select League 1</option>
          {leagues.map((league) => {
            const id = league.league?.id || league.id;
            const name = league.league?.name || league.name;
            return (
              <option key={id} value={id}>
                {name}
              </option>
            );
          })}
        </select>
        <span>vs</span>
        <select value={league2} onChange={(e) => setLeague2(e.target.value)}>
          <option value="">Select League 2</option>
          {leagues.map((league) => {
            const id = league.league?.id || league.id;
            const name = league.league?.name || league.name;
            return (
              <option key={id} value={id}>
                {name}
              </option>
            );
          })}
        </select>
        <button
          onClick={handleAddFixture}
          disabled={!league1 || !league2 || league1 === league2}
        >
          Add Fixture
        </button>
      </div>
      <div className="fixtures-container">
        {fixtures.map((fixture, index) => (
          <FixtureCard
            league1={fixture.league1.league?.name || fixture.league1.name}
            league2={fixture.league2.league?.name || fixture.league2.name}
            league1Points={0}
            league2Points={0}
            key={index}
          />
        ))}
      </div>
    </div>
  );
}

export default FixtureList;
