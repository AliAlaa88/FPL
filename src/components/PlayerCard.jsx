import './PlayerCard.css';

function PlayerCard({ player, selected, onSelect, doubled }) {
  return (
    <div className={`player-card horizontal${selected ? ' selected' : ''}`} onClick={onSelect}>
      <span className="player-id">ID: {player.id}</span>
      <span className="entry-name">{player.entry_name}</span>
      <span className="event-total">GW Points: <b>{doubled ? player.event_total * 2 : player.event_total}</b></span>
    </div>
  );
}

export default PlayerCard;
