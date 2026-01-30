import "./PlayerCard.css";

function PlayerCard({ player, selected, onSelect, factor, isFreeHit }) {
  return (
    <div
      className={`player-card horizontal${selected ? " selected" : ""}`}
      onClick={onSelect}
    >
      <span className="player-id">ID: {player.entry_id}</span>
      <span className="entry-name">{player.name}</span>
      <span className="event-total">
        GW Points:{" "}
        <b>
          {(player.gameweeks[0].points +
            (isFreeHit ? 0 : player.gameweeks[0].transfers_cost)) *
            factor}
        </b>
      </span>
      {!isFreeHit && player.gameweeks[0].transfers_cost > 0 && (
        <span className="event-total negative">
          <b>-{player.gameweeks[0].transfers_cost * factor}</b>
        </span>
      )}
    </div>
  );
}

export default PlayerCard;
