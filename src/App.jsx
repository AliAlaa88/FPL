import { useState, useEffect } from 'react';
import './App.css';

const NUM_CARDS = 20;
const CARDS_PER_ROW = 4;

const ids = [
  418940, 307140, 767007, 805231, 712543, 863026, 673216, 1074101, 666058, 572827, 348627, 384960, 2193, 2587078, 797003, 798822, 400715, 412945, 601655, 576117
];

const App = () => {
  return (
    <div className="container">
      <h1>Football Land</h1>
      <div className="multi-league-list">
        {Array.from({ length: Math.ceil(ids.length / CARDS_PER_ROW) }).map((_, rowIdx) => (
          <div className="league-row" key={rowIdx}>
            {ids.slice(rowIdx * CARDS_PER_ROW, (rowIdx + 1) * CARDS_PER_ROW).map((id, colIdx) => (
              <LeagueCard key={id} initialLeagueId={id} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

function LeagueCard({ initialLeagueId }) {
  const [leagueId, setLeagueId] = useState(initialLeagueId ? initialLeagueId.toString() : '');
  const [data, setData] = useState(null);
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
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setData(json);
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
            <span className="league-name">Name: <b>{data.league.name}</b></span>
            <span className="league-id">ID: <b>{data.league.id}</b></span>
            <span className="league-gw-points">GW Points: <b>{data.standings.results.reduce((sum, p) => sum + (selected === p.id ? p.event_total * 2 : p.event_total), 0)}</b></span>
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

function PlayerCard({ player, selected, onSelect, doubled }) {
  return (
    <div className={`player-card horizontal${selected ? ' selected' : ''}`} onClick={onSelect}>
      <span className="player-id">ID: {player.id}</span>
      <span className="entry-name">{player.entry_name}</span>
      <span className="event-total">GW Points: <b>{doubled ? player.event_total * 2 : player.event_total}</b></span>
    </div>
  );
}

export default App;
