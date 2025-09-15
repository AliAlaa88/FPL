export class StandingsController {
  constructor(standingsService) {
    this.standingsService = standingsService;
  }

  // Get standings
  getStandings = async (req, res) => {
    try {
      const standings = await this.standingsService.getStandings();
      res.json(standings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
