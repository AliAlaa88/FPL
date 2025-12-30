export class standingsService {
  constructor(standingsRepository) {
    this.standingsRepository = standingsRepository;
  }
  // Get standings
  getStandings = async (gameWeek) => {
    return await this.standingsRepository.getStandings(gameWeek);
  };
}
