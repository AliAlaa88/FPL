import { useEffect, useState } from "react";
import LeagueList from "./components/LeagueList";
import FixtureList from "./components/FixtureList";
import Standing from "./components/Standing";
import GameWeek from "./components/GameWeek";
import "./App.css";

const App = () => {
  const [currentGameWeek, setCurrentGameWeek] = useState(1);
  const [maxGameWeek, setMaxGameWeek] = useState(1);

  const handlePreviousGW = () => {
    setCurrentGameWeek(prev => Math.max(1, prev - 1));
  };

  const handleNextGW = () => {
    setCurrentGameWeek(prev => Math.min(maxGameWeek, prev + 1));
  };

  useEffect(() => {
    fetch('http://localhost:3001/api/gameweeks/current')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.success && data.data && data.data.event) {
          const fetchedGW = parseInt(data.data.event);
          setCurrentGameWeek(fetchedGW);
          setMaxGameWeek(fetchedGW);
        }
      })
      .catch(error => {
        console.error('Error fetching current gameweek:', error);
      });
  }, []);

  return (
    <>
      <h1>Football Land</h1>
      <GameWeek 
        currentGW={currentGameWeek}
        onPrevious={handlePreviousGW}
        onNext={handleNextGW}
        maxGW={maxGameWeek}
      />
      <div className="app">
          <LeagueList currentGameWeek={currentGameWeek} />
          <FixtureList currentGameWeek={currentGameWeek} />
          <Standing currentGameWeek={currentGameWeek} />
      </div>
    </>
  );
};

export default App;
