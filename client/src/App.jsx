import { useEffect, useState } from "react";
import LeagueList from "./components/LeagueList";
import FixtureList from "./components/FixtureList";
import Standing from "./components/Standing";
import GameWeek from "./components/GameWeek";
import "./App.css";

const App = () => {
  const [currentGameWeek, setCurrentGameWeek] = useState(null);
  const [maxGameWeek, setMaxGameWeek] = useState(1);
  const [activeTab, setActiveTab] = useState('leagues');

  const handlePreviousGW = () => {
    setCurrentGameWeek(prev => Math.max(1, prev - 1));
    setActiveTab('leagues');
  };
  
  const handleNextGW = () => {
    setCurrentGameWeek(prev => Math.min(maxGameWeek, prev + 1));
    setActiveTab('leagues');
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
        if (data.week_number) {
          const fetchedGW = parseInt(data.week_number);
          setCurrentGameWeek(fetchedGW);
          setMaxGameWeek(fetchedGW);
        } else {
          console.error('Invalid data format:', data);
        }
      })
      .catch(error => {
        console.error('Error fetching current gameweek:', error);
      });
  }, []);

  const renderTabContent = () => {
    switch(activeTab) {
      case 'leagues':
        return <LeagueList currentGameWeek={currentGameWeek} />;
      case 'fixtures':
        return <FixtureList currentGameWeek={currentGameWeek} />;
      case 'standings':
        return <Standing currentGameWeek={currentGameWeek} />;
      default:
        return <LeagueList currentGameWeek={currentGameWeek} />;
    }
  };

  return (
    <>
      <GameWeek 
        currentGW={currentGameWeek}
        onPrevious={handlePreviousGW}
        onNext={handleNextGW}
        maxGW={maxGameWeek}
      />
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'leagues' ? 'active' : ''}`}
          onClick={() => setActiveTab('leagues')}
        >
          Leagues
        </button>
        <button 
          className={`tab ${activeTab === 'fixtures' ? 'active' : ''}`}
          onClick={() => setActiveTab('fixtures')}
        >
          Fixtures
        </button>
        <button 
          className={`tab ${activeTab === 'standings' ? 'active' : ''}`}
          onClick={() => setActiveTab('standings')}
        >
          Standings
        </button>
      </div>
      <div className="app">
        {renderTabContent()}
      </div>
    </>
  );
};

export default App;
