import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useParams,
  useNavigate,
  NavLink,
} from "react-router-dom";
import LeagueList from "./components/LeagueList";
import FixtureList from "./components/FixtureList";
import Standing from "./components/Standing";
import GameWeek from "./components/GameWeek";
import LeagueDetailsPage from "./components/LeagueDetailsPage";
import "./App.css";

const TabContent = () => {
  const { gameweek, tab } = useParams();
  const currentGameWeek = parseInt(gameweek);

  switch (tab) {
    case "leagues":
      return <LeagueList currentGameWeek={currentGameWeek} />;
    case "fixtures":
      return <FixtureList currentGameWeek={currentGameWeek} />;
    case "standings":
      return <Standing currentGameWeek={currentGameWeek} />;
    default:
      return <LeagueList currentGameWeek={currentGameWeek} />;
  }
};

const HomePage = () => {
  const { gameweek, tab } = useParams();
  const navigate = useNavigate();
  const currentGameWeek = parseInt(gameweek);
  const [maxGameWeek, setMaxGameWeek] = useState(currentGameWeek || 1);

  useEffect(() => {
    fetch("http://localhost:3001/api/gameweeks/current")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.week_number) {
          const fetchedGW = parseInt(data.week_number);
          setMaxGameWeek(fetchedGW);
        } else {
          console.error("Invalid data format:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching current gameweek:", error);
      });
  }, []);

  const handlePreviousGW = () => {
    const newGW = Math.max(1, currentGameWeek - 1);
    navigate(`/gw/${newGW}/${tab}`);
  };

  const handleNextGW = () => {
    const newGW = Math.min(maxGameWeek, currentGameWeek + 1);
    navigate(`/gw/${newGW}/${tab}`);
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
        <NavLink
          to={`/gw/${currentGameWeek}/leagues`}
          className={({ isActive }) => `tab ${isActive ? "active" : ""}`}
        >
          Leagues
        </NavLink>
        <NavLink
          to={`/gw/${currentGameWeek}/fixtures`}
          className={({ isActive }) => `tab ${isActive ? "active" : ""}`}
        >
          Fixtures
        </NavLink>
        <NavLink
          to={`/gw/${currentGameWeek}/standings`}
          className={({ isActive }) => `tab ${isActive ? "active" : ""}`}
        >
          Standings
        </NavLink>
      </div>
      <div className="app">
        <TabContent />
      </div>
    </>
  );
};

const DefaultRedirect = () => {
  const [currentGW, setCurrentGW] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/gameweeks/current")
      .then((response) => response.json())
      .then((data) => {
        if (data.week_number) {
          setCurrentGW(parseInt(data.week_number));
        } else {
          setCurrentGW(1);
        }
      })
      .catch(() => setCurrentGW(1));
  }, []);

  if (currentGW === null) {
    return <div className="loading">Loading...</div>;
  }

  return <Navigate to={`/gw/${currentGW}/leagues`} replace />;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<DefaultRedirect />} />
      <Route path="/gw/:gameweek/:tab" element={<HomePage />} />
      <Route path="/league/:teamId" element={<LeagueDetailsPage />} />
    </Routes>
  );
};

export default App;
