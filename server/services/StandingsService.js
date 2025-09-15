export class standingsService {
  constructor(standingsRepository) {
    this.standingsRepository = standingsRepository;
  }
  // Get standings
  getStandings = async () => {
    return await this.standingsRepository.getStandings();
  };
}
