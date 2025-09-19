import React, { useEffect, useState, useCallback } from "react";
import { useLeagues } from "../context/leaguesContext";
import "./FixtureList.css";
import FixtureCard from "./FixtureCard";

function FixtureList({ currentGameWeek }) {
  const { leagueNames, setLeagueNames, teamTotalPoints, setTeamTotalPoints } =
    useLeagues();
  const [fixtures, setFixtures] = useState([]);
  const [league1, setLeague1] = useState("");
  const [league2, setLeague2] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        // console.log("Fetched fixtures:", fixturesData);
      } catch (err) {
        console.error("Error fetching fixtures:", err);
      }
    };

    fetchFixtures();
  }, [currentGameWeek]);

  // Get leagues that are already used in fixtures
  const getUsedLeagues = () => {
    const used = new Set();
    fixtures.forEach((fixture) => {
      if (fixture.homeTeam && fixture.awayTeam) {
        used.add(fixture.homeTeam.id.toString());
        used.add(fixture.awayTeam.id.toString());
      } else if (fixture.league1Id && fixture.league2Id) {
        used.add(fixture.league1Id);
        used.add(fixture.league2Id);
      }
    });
    return used;
  };

  // Get available leagues for selection
  const getAvailableLeagues = (excludeId = null) => {
    const usedLeagues = getUsedLeagues();
    return Object.entries(leagueNames).filter(([leagueId, leagueName]) => {
      return !usedLeagues.has(leagueId) || leagueId === excludeId;
    });
  };

  const handleAddFixture = () => {
    if (league1 && league2 && league1 !== league2) {
      const newFixture = {
        homeTeam: { id: league1, name: leagueNames[league1] },
        awayTeam: { id: league2, name: leagueNames[league2] },
        home_team_id: league1,
        away_team_id: league2,
        home_points: teamTotalPoints[league1] || 0,
        away_points: teamTotalPoints[league2] || 0,
        gameweek: { week_number: currentGameWeek },
      };

      setFixtures([...fixtures, newFixture]);
      setLeague1("");
      setLeague2("");
    }
  };

  const handleSubmitFixtures = async () => {
    const newFixtures = fixtures.filter((f) => !f.id || f.id > 1000000); // Only submit new fixtures (with temporary IDs)
    if (newFixtures.length === 0) return;

    setIsSubmitting(true);
    try {
      const fixturesToSubmit = newFixtures.map((fixture) => ({
        gameweek_id: currentGameWeek,
        home_team_id: fixture.home_team_id,
        away_team_id: fixture.away_team_id,
        home_points: teamTotalPoints[fixture.home_team_id] || 0,
        away_points: teamTotalPoints[fixture.away_team_id] || 0,
      }));

      const response = await fetch("/api/fixtures/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fixturesToSubmit),
      });

      if (!response.ok) {
        throw new Error("Failed to submit fixtures");
      }

      const result = await response.json();
      console.log("Fixtures submitted successfully:", result);

      // Refresh fixtures from API
      const fetchResponse = await fetch(
        `/api/fixtures/gameweek/${currentGameWeek}`
      );
      if (fetchResponse.ok) {
        const fixturesData = await fetchResponse.json();
        setFixtures(fixturesData || []);
      }
    } catch (error) {
      console.error("Error submitting fixtures:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableLeagues = getAvailableLeagues(league2);

  return (
    <div className="fixtureList">
        <h2>Fixtures</h2>
        <button
          onClick={handleSubmitFixtures}
          disabled={
            isSubmitting ||
            fixtures.filter((f) => !f.id || f.id > 1000000).length === 0
          }
          className="submit-fixtures-btn"
        >
          {isSubmitting
            ? "Submitting..."
            : `Submit ${
                fixtures.filter((f) => !f.id || f.id > 1000000).length
              } New Fixtures`}
        </button>
        <div className="fixtures-controls">
          <div className="fixtures-selects">
            <select value={league1} onChange={(e) => setLeague1(e.target.value)}>
              <option value="">Select League 1</option>
              {availableLeagues.map(([leagueId, leagueName]) => (
                <option key={leagueId} value={leagueId}>
                  {leagueName}
                </option>
              ))}
            </select>
            <span>vs</span>
            <select value={league2} onChange={(e) => setLeague2(e.target.value)}>
              <option value="">Select League 2</option>
              {availableLeagues.map(([leagueId, leagueName]) => (
                <option key={leagueId} value={leagueId}>
                  {leagueName}
                </option>
              ))}
            </select>
          </div>
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
