/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";

const LeaguesContext = createContext();

export const useLeagues = () => useContext(LeaguesContext);

export const LeaguesProvider = ({ children }) => {
  const [leagues, setLeagues] = useState([]);
  const [leaguePoints, setLeaguePoints] = useState({});

  return (
    <LeaguesContext.Provider value={{ leagues, setLeagues, leaguePoints, setLeaguePoints }}>
      {children}
    </LeaguesContext.Provider>
  );
};
