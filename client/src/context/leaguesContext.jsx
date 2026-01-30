/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";

const LeaguesContext = createContext();

export const useLeagues = () => useContext(LeaguesContext);

export const LeaguesProvider = ({ children }) => {
  const [leagueNames, setLeagueNames] = useState([]);

  return (
    <LeaguesContext.Provider
      value={{
        leagueNames,
        setLeagueNames,
      }}
    >
      {children}
    </LeaguesContext.Provider>
  );
};
