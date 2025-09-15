import React from "react";
import "./FixtureCard.css";

function FixtureCard({ homeTeam, awayTeam, homePoints, awayPoints, gameweek }) {
  let winner = null;
  let result = "";

  if (homePoints > awayPoints) {
    winner = homeTeam;
    result = "W";
  } else if (awayPoints > homePoints) {
    winner = awayTeam;
    result = "W";
  } else {
    winner = "Draw";
    result = "D";
  }

  return (
    <div className="fixture-card">
      <div className="gameweek-info">
        <span>Gameweek {gameweek}</span>
      </div>
      <h3>
        {homeTeam} <b>({homePoints})</b> vs {awayTeam} <b>({awayPoints})</b>
      </h3>
      <div className="result">
        Winner: <b>{winner}</b>
      </div>
    </div>
  );
}

export default FixtureCard;