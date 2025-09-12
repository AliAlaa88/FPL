import { useState, useEffect } from "react";
import { useLeagues } from "../context/leaguesContext";
import PlayerCard from "./PlayerCard";
import "./LeagueCard.css";

function LeagueCard({ initialLeagueId }) {
  const [leagueId, setLeagueId] = useState(
    initialLeagueId ? initialLeagueId.toString() : ""
  );
  const [data, setData] = useState(null);
  const { leagues, setLeagues } = useLeagues();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  // Fetch data initially if initialLeagueId is provided
  useEffect(() => {
    if (initialLeagueId) {
      fetchStandingsById(initialLeagueId);
    }
    // eslint-disable-next-line
  }, [initialLeagueId]);

  const handleChange = (e) => {
    setLeagueId(e.target.value);
  };

  const fetchStandingsById = async (id) => {
    setLoading(true);
    setError(null);
    setData(null);
    let url = `/api/leagues-classic/${id}/standings`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setData(json);
      // Add or update league data in context
      setLeagues((prevLeagues) => {
        // Remove any existing league with the same id
        const filtered = prevLeagues.filter(
          (l) => l.league?.id !== json.league?.id
        );
        return [...filtered, json];
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStandings = async (e) => {
    e.preventDefault();
    if (!leagueId) return;
    fetchStandingsById(leagueId);
  };

  return (
    <div className="league-card small">
      <form onSubmit={fetchStandings} className="form-inline">
        <input
          type="text"
          placeholder="League ID"
          value={leagueId}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading} className="tick-btn">
          ✓
        </button>
      </form>
      {error && <p className="error">Error: {error}</p>}
      {data && data.league && data.standings && (
        <>
          <div className="league-info small">
            <span>
              Name: <b>{data.league.name}</b>
            </span>
            <span>
              ID: <b>{data.league.id}</b>
            </span>
            <span>
              GW Points:{" "}
              <b>
                {data.standings.results.reduce(
                  (sum, p) =>
                    sum +
                    (selected === p.id ? p.event_total * 2 : p.event_total),
                  0
                )}
              </b>
            </span>
          </div>
          <div className="players-vertical">
            {data.standings.results.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                selected={selected === player.id}
                onSelect={() => setSelected(player.id)}
                doubled={selected === player.id}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default LeagueCard;
