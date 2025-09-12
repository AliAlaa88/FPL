import React from "react";
import "./FixtureCard.css";
function FixtureCard({ league1, league2, league1Points, league2Points }) {
  let winner = null;
  if (league1Points > league2Points) winner = league1;
  else if (league2Points > league1Points) winner = league2;
  else if (league1Points === league2Points) winner = "Draw";

  return (
    <div className="fixture-card">
      <h3>
        {league1} <b>({league1Points})</b> vs {league2} <b>({league2Points})</b>
      </h3>
      <div>
        Winner: <b>{winner}</b>
      </div>
    </div>
  );
}

export default FixtureCard;
