import LeagueList from "./components/LeagueList";
import FixtureList from "./components/FixtureList";
import Standing from "./components/Standing";
import "./App.css";

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
      <div className="container">
        <Standing />
      </div>
    </div>
  );
};

export default App;
