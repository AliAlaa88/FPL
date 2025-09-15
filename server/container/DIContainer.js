// Repositories
import { TeamRepository } from "../repositories/implementations/TeamRepository.js";
import { GameWeekRepository } from "../repositories/implementations/GameWeekRepository.js";
import { FixtureRepository } from "../repositories/implementations/FixtureRepository.js";
import { PlayerRepository } from "../repositories/implementations/PlayerRepository.js";

// Services
import { TeamService } from "../services/TeamService.js";
import { GameWeekService } from "../services/GameWeekService.js";
import { FixtureService } from "../services/FixtureService.js";

// Controllers
import { TeamController } from "../controllers/TeamController.js";
import { GameWeekController } from "../controllers/GameWeekController.js";
import { FixtureController } from "../controllers/FixtureController.js";

class DIContainer {
  constructor() {
    this.dependencies = new Map();
    this.singletons = new Map();
    this.setupDependencies();
  }

  setupDependencies() {
    // Repositories (Singletons)
    this.register("TeamRepository", () => new TeamRepository(), true);
    this.register("GameWeekRepository", () => new GameWeekRepository(), true);
    this.register("FixtureRepository", () => new FixtureRepository(), true);
    this.register("PlayerRepository", () => new PlayerRepository(), true);

    // Services (Singletons)
    this.register(
      "TeamService",
      () => new TeamService(this.get("TeamRepository")),
      true
    );

    this.register(
      "GameWeekService",
      () => new GameWeekService(this.get("GameWeekRepository")),
      true
    );

    this.register(
      "FixtureService",
      () => new FixtureService(this.get("FixtureRepository")),
      true
    );

    // Controllers (New instance each time)
    this.register(
      "TeamController",
      () => new TeamController(this.get("TeamService")),
      false
    );

    this.register(
      "GameWeekController",
      () => new GameWeekController(this.get("GameWeekService")),
      false
    );

    this.register(
      "FixtureController",
      () => new FixtureController(this.get("FixtureService")),
      false
    );
  }

  register(name, factory, singleton = false) {
    this.dependencies.set(name, { factory, singleton });
  }

  get(name) {
    const dependency = this.dependencies.get(name);

    if (!dependency) {
      throw new Error(
        `Dependency '${name}' not found. Available dependencies: ${Array.from(
          this.dependencies.keys()
        ).join(", ")}`
      );
    }

    const { factory, singleton } = dependency;

    if (singleton) {
      if (!this.singletons.has(name)) {
        this.singletons.set(name, factory());
      }
      return this.singletons.get(name);
    }

    return factory();
  }

  // Method to check if a dependency is registered
  has(name) {
    return this.dependencies.has(name);
  }

  // Method to get all registered dependency names
  getRegisteredNames() {
    return Array.from(this.dependencies.keys());
  }
}

// Export singleton instance
export default new DIContainer();
