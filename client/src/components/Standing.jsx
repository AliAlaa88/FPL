import { useLeagues } from "../context/leaguesContext";

const Standing = () => {
  const { leagues, leaguePoints } = useLeagues();
  return (
    <>
      <div className="container">
        <h2>Standings</h2>
        {leagues
          .sort((a, b) => {
            const aLeague = leaguePoints[a.name] || {};
            const bLeague = leaguePoints[b.name] || {};

            const aLive = aLeague.liveLeaguePoints || 0;
            const bLive = bLeague.liveLeaguePoints || 0;

            if (aLive !== bLive) {
              return bLive - aLive; // primary sort
            }

            const aTotal = aLeague.liveTotalPoints || 0;
            const bTotal = bLeague.liveTotalPoints || 0;

            return bTotal - aTotal; // secondary sort
          })
          .map((league) => (
            <div key={league.id}>
              <div>{league.name}</div>
              <div>
                {leaguePoints[league.name]?.liveLeaguePoints || 0} pts -{" "}
                {leaguePoints[league.name]?.liveTotalPoints || 0} score
              </div>
              <br />
            </div>
          ))}
      </div>
    </>
  );
};

export default Standing;
