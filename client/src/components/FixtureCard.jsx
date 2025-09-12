import React, { useEffect } from "react";
import "./FixtureCard.css";
function FixtureCard({ league1, league2, league1Points, league2Points, handleStandingChange }) {
  let winner = null;
  
  useEffect(() => {
    let league1NewPoints = 0;
    let league2NewPoints = 0;
    
    if (league1Points > league2Points) {
      league1NewPoints = 3;
      league2NewPoints = 0;
    } else if (league2Points > league1Points) {
      league1NewPoints = 0;
      league2NewPoints = 3;
    } else if (league1Points === league2Points) {
      league1NewPoints = 1;
      league2NewPoints = 1;
    }
    
    handleStandingChange(league1, league1NewPoints, league1Points, league2, league2NewPoints, league2Points);
  }, [league1, league2, league1Points, league2Points, handleStandingChange]);

  if (league1Points > league2Points) {
    winner = league1;
  } else if (league2Points > league1Points) {
    winner = league2;
  } else if (league1Points === league2Points) {
    winner = "Draw";
  }

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
