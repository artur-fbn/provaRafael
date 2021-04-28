import Individual from './Individual';
import Population from './Population';

// Comando para rodar algoritmo: yarn ex9

class Q9 {
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
    const crossOverPointOne = 2;
    const crossOverPointTwo = 4;
    const crossOverPointThree = 6;
    const crossOverPointFour = 8;

    let index = this.selectedIndividuals.length - 1;

    for (let i = 0; i < this.selectedIndividuals.length / 2; i++) {
      const parentOneGenes = this.selectedIndividuals[index].genes;
      const parentTwoGenes = this.selectedIndividuals[index - 1].genes;

      let genes: number[] = [];

      let firstPiece = parentOneGenes.slice(0, crossOverPointOne);
      let secondPiece = parentTwoGenes.slice(
        crossOverPointOne,
        crossOverPointTwo,
      );
      let thirdPiece = parentOneGenes.slice(
        crossOverPointTwo,
        crossOverPointThree,
      );
      let fourthPiece = parentTwoGenes.slice(
        crossOverPointThree,
        crossOverPointFour,
      );
      let fifthPiece = parentOneGenes.slice(
        crossOverPointFour,
        parentOneGenes.length,
      );

      genes = [
        ...firstPiece,
        ...secondPiece,
        ...thirdPiece,
        ...fourthPiece,
        ...fifthPiece,
      ];

      let newIndividual = new Individual({
        length: this.population.individuals[0].geneLength,
        genes,
      });

      this.newIndividuals.push(newIndividual);

      firstPiece = parentTwoGenes.slice(0, crossOverPointOne);
      secondPiece = parentOneGenes.slice(crossOverPointOne, crossOverPointTwo);
      thirdPiece = parentTwoGenes.slice(crossOverPointTwo, crossOverPointThree);
      fourthPiece = parentOneGenes.slice(
        crossOverPointThree,
        crossOverPointFour,
      );
      fifthPiece = parentTwoGenes.slice(
        crossOverPointFour,
        parentOneGenes.length,
      );

      genes = [
        ...firstPiece,
        ...secondPiece,
        ...thirdPiece,
        ...fourthPiece,
        ...fifthPiece,
      ];

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

const ex9 = new Q9();

// Passar intervalo de x e tamanho do número binário
ex9.population.initializePopulation(0, 800, 10);
ex9.population.calculateFitness();

console.log(
  `Generation: ${ex9.generationCount} Fittest: ${ex9.population.fittest}`,
);

while (ex9.population.fittest > -20) {
  ex9.generationCount++;

  ex9.selection();

  ex9.crossover();

  ex9.mutation();

  ex9.population.calculateFitness();

  console.log(
    `Generation: ${ex9.generationCount} Fittest: ${ex9.population.fittest}`,
  );
}

console.log(`Solution found in generation ${ex9.generationCount}`);
console.log(`Fitness: ${ex9.population.getFittest().fitness}`);
console.log('Genes:');

let fittest = '';

for (let i = 0; i < ex9.population.individuals[0].geneLength; i++) {
  fittest += ex9.population.getFittest().genes[i];
}

console.log(fittest);
