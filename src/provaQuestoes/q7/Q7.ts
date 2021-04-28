import Individual from './Individual';
import Population from './Population';

// Comando para rodar algoritmo: yarn ex7

class Q7 {
  population: Population = new Population();

  selectedIndividuals: Individual[] = [];

  newIndividuals: Individual[] = [];

  generationCount = 0;

  selection(): void {
    const n = 3;
    let currentIndex: number[] = [];

    for (let i = 0; i < this.population.popSize / 2; i++) {
      const match: Individual[] = [];

      for (let y = 0; y < n; y++) {
        let index = Math.floor(Math.random() * this.population.popSize);

        while (currentIndex.includes(index)) {
          index = Math.floor(Math.random() * this.population.popSize);
        }

        currentIndex.push(index);

        match.push(this.population.individuals[index]);
      }

      let winner = new Individual({});
      winner.fitness = Number.MAX_VALUE;

      match.forEach(individual => {
        if (individual.fitness < winner.fitness) {
          winner = individual;
        }
      });

      this.selectedIndividuals.push(winner);

      currentIndex = [];
    }
  }

  crossover(): void {
    const crossOverPointOne =
      Math.floor(
        Math.random() * (this.population.individuals[0].geneLength / 2 - 2),
      ) + 1;

    let crossOverPointTwo =
      Math.floor(
        Math.random() * (this.population.individuals[0].geneLength / 2 - 1),
      ) +
      this.population.individuals[0].geneLength / 2;

    while (crossOverPointOne === crossOverPointTwo) {
      crossOverPointTwo = Math.floor(
        Math.random() * this.population.individuals[0].geneLength,
      );
    }

    let index = this.selectedIndividuals.length - 1;

    for (let i = 0; i < this.selectedIndividuals.length / 2; i++) {
      const parentOneGenes = this.selectedIndividuals[index].genes;
      const parentTwoGenes = this.selectedIndividuals[index - 1].genes;

      let genes: number[] = [];

      let part1 = parentOneGenes.slice(0, crossOverPointOne);
      let part2 = parentTwoGenes.slice(
        crossOverPointOne,
        crossOverPointTwo,
      );
      let part3 = parentOneGenes.slice(
        crossOverPointTwo,
        parentOneGenes.length,
      );

      genes = [...part1, ...part2, ...part3];

      let newIndividual = new Individual({
        length: this.population.individuals[0].geneLength,
        genes,
      });

      this.newIndividuals.push(newIndividual);

      part1 = parentTwoGenes.slice(0, crossOverPointOne);
      part2 = parentOneGenes.slice(crossOverPointOne, crossOverPointTwo);
      part3 = parentTwoGenes.slice(
        crossOverPointTwo,
        parentOneGenes.length,
      );

      genes = [...part1, ...part2, ...part3];

      newIndividual = new Individual({
        length: this.population.individuals[0].geneLength,
        genes,
      });

      this.newIndividuals.push(newIndividual);

      index -= 2;
    }
  }

  mutation(): void {
    const mutatedIndividuals = this.newIndividuals.map(individual => {
      const newGenes = individual.genes.map(gene => {
        if (Math.random() <= 0.01) {
          if (gene === 0) {
            return 1;
          }

          return 0;
        }

        return gene;
      });

      return new Individual({
        length: this.population.individuals[0].geneLength,
        genes: newGenes,
      });
    });

    this.population.individuals = [
      ...this.selectedIndividuals,
      ...mutatedIndividuals,
    ];
  }
}

const ex7 = new Q7();

// Passar intervalo de x e tamanho do número binário
ex7.population.initializePopulation(0, 300, 9);
ex7.population.calculateFitness();

console.log(
  `Generation: ${ex7.generationCount} Fittest: ${ex7.population.fittest}`,
);

while (ex7.population.fittest > 2) {
  ex7.generationCount++;

  ex7.selection();

  ex7.crossover();

  ex7.mutation();

  ex7.population.calculateFitness();

  console.log(
    `Generation: ${ex7.generationCount} Fittest: ${ex7.population.fittest}`,
  );
}

console.log(`Solution found in generation ${ex7.generationCount}`);
console.log(`Fitness: ${ex7.population.getFittest().fitness}`);
console.log('Genes:');

let fittest = '';

for (let i = 0; i < ex7.population.individuals[0].geneLength; i++) {
  fittest += ex7.population.getFittest().genes[i];
}

console.log(fittest);
