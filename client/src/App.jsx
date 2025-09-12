import LeagueList from "./components/LeagueList";
import "./App.css";
import FixtureList from "./components/FixtureList";

const App = () => {
  return (
    <div className="app">
      <div className="container">
        <h1>Football Land</h1>
        <LeagueList />
      </div>
      <div className="container">
        <FixtureList />
      </div>
    </div>
  );
};

export default App;
