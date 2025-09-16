export class StandingsController {
  constructor(standingsService) {
    this.standingsService = standingsService;
  }

  // Get standings
  getStandings = async (req, res) => {
    try {
      const { gameweek } = req.query;
      const standings = await this.standingsService.getStandings(gameweek);
      res.json(standings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
