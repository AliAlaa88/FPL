import LeagueCard from './LeagueCard';
import './LeagueList.css';

const ids = [
  418940, 307140, 767007, 805231, 712543, 863026, 673216, 1074101, 666058, 572827, 348627, 384960, 2193, 2587078, 797003, 798822, 400715, 412945, 601655, 576117
];

function LeagueList() {
  return (
    <div className="multi-league-list">
      {ids.map((id) => (
        <LeagueCard key={id} initialLeagueId={id} />
      ))}
    </div>
  );
}

export default LeagueList;
