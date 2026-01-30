import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GWHistoryTable from "./GWHistoryTable";
import { API_BASE_URL } from "../config";
import "./LeagueDetailsPage.css";

function LeagueDetailsPage() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamHistory = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/api/teams/${teamId}/history`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch team history");
        }
        const data = await response.json();
        setTeamData(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching team history:", err);
      } finally {
        setLoading(false);
      }
    };

    if (teamId) {
      fetchTeamHistory();
    }
  }, [teamId]);

  if (loading) {
    return (
      <div className="league-details-page">
        <div className="loading">Loading team history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="league-details-page">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="league-details-page">
      <div className="details-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1>{teamData?.name}</h1>
      </div>

      {teamData && (
        <GWHistoryTable
          players={teamData.players}
          captaincies={teamData.captaincies}
          chips={teamData.chips}
          fixtures={teamData.fixtures}
        />
      )}
    </div>
  );
}

export default LeagueDetailsPage;
