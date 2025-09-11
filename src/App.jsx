
import { useState } from 'react';
import './App.css';
import './App.css';

const NUM_CARDS = 20;
const CARDS_PER_ROW = 5;

const App = () => {
  return (
    <div className="container">
      <h1>FPL Classic League Standings</h1>
      <div className="multi-league-list">
        {Array.from({ length: Math.ceil(NUM_CARDS / CARDS_PER_ROW) }).map((_, rowIdx) => (
          <div className="league-row" key={rowIdx}>
            {Array.from({ length: CARDS_PER_ROW }).map((_, colIdx) => {
              const idx = rowIdx * CARDS_PER_ROW + colIdx;
              return idx < NUM_CARDS ? <LeagueCard key={idx} /> : null;
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

function LeagueCard() {
  const [leagueId, setLeagueId] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  const handleChange = (e) => {
    setLeagueId(e.target.value);
  };

  const fetchStandings = async (e) => {
    e.preventDefault();
    if (!leagueId) return;
    setLoading(true);
    setError(null);
    setData(null);
    let url = `/api/leagues-classic/${leagueId}/standings`;
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
          <h2 className="league-title">{data.league.name}</h2>
          <div className="league-info small">
            <span>ID: <b>{data.league.id}</b></span>
            <span style={{marginLeft: '0.5em'}}>GW Points: <b>{data.standings.results.reduce((sum, p) => sum + (selected === p.id ? p.event_total * 2 : p.event_total), 0)}</b></span>
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
    <div className={`player-card vertical${selected ? ' selected' : ''}`} onClick={onSelect}>
      <span className="player-name">{player.player_name}</span>
      <span className="player-id">ID: {player.id}</span>
      <span className="entry-name">Team: {player.entry_name}</span>
      <span className="event-total">GW Points: <b>{doubled ? player.event_total * 2 : player.event_total}</b></span>
    </div>
  );
}

export default App;
