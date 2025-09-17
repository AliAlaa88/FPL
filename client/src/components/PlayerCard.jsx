import "./PlayerCard.css";

function PlayerCard({ player, selected, onSelect, factor }) {
  return (
    <div
      className={`player-card horizontal${selected ? " selected" : ""}`}
      onClick={onSelect}
    >
      <span className="player-id">ID: {player.entry_id}</span>
      <span className="entry-name">{player.name}</span>
      <span className="event-total">
        GW Points: <b>{player.gameweeks[0].points * factor}</b>
      </span>
    </div>
  );
}

export default PlayerCard;
