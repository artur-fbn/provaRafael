import Individual from './Individual';

class Population {
  popSize = 8;

  individuals: Individual[] = [];

  fittest = 0;

  initializePopulation(min: number, max: number, length: number): void {
    for (let i = 0; i < this.popSize; i++) {
      this.individuals[i] = new Individual({ min, max, length });
    }
  }

  getFittest(): Individual {
    let fittest = Number.MAX_VALUE;
    let i: Individual = new Individual({});

    this.individuals.forEach(individual => {
      if (individual.fitness < fittest) {
        fittest = individual.fitness;
        i = individual;
      }
    });

    this.fittest = fittest;
    return i;
  }

  calculateFitness(): void {
    this.individuals.forEach(individual => {
      individual.calcFitness();
    });

    this.getFittest();
  }
}

export default Population;
