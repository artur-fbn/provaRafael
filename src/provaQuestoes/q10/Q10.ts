import Individual from './Individual';
import Population from './Population';

// Comando para rodar algoritmo: yarn ex10

class Q10 {
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

      let firstPiece = parentOneGenes.slice(0, crossOverPointOne);
      let secondPiece = parentTwoGenes.slice(
        crossOverPointOne,
        crossOverPointTwo,
      );
      let thirdPiece = parentOneGenes.slice(
        crossOverPointTwo,
        parentOneGenes.length,
      );

      genes = [...firstPiece, ...secondPiece, ...thirdPiece];

      let newIndividual = new Individual({
        length: this.population.individuals[0].geneLength,
        genes,
      });

      this.newIndividuals.push(newIndividual);

      firstPiece = parentTwoGenes.slice(0, crossOverPointOne);
      secondPiece = parentOneGenes.slice(crossOverPointOne, crossOverPointTwo);
      thirdPiece = parentTwoGenes.slice(
        crossOverPointTwo,
        parentOneGenes.length,
      );

      genes = [...firstPiece, ...secondPiece, ...thirdPiece];

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

const ex10 = new Q10();

// Passar intervalo de x e tamanho do número binário
ex10.population.initializePopulation(0, 1000, 10);
ex10.population.calculateFitness();

console.log(
  `Generation: ${ex10.generationCount} Fittest: ${ex10.population.fittest}`,
);

while (ex10.population.fittest > -57) {
  ex10.generationCount++;

  ex10.selection();

  ex10.crossover();

  ex10.mutation();

  ex10.population.calculateFitness();

  console.log(
    `Generation: ${ex10.generationCount} Fittest: ${ex10.population.fittest}`,
  );
}

console.log(`Solution found in generation ${ex10.generationCount}`);
console.log(`Fitness: ${ex10.population.getFittest().fitness}`);
console.log('Genes:');

let fittest = '';

for (let i = 0; i < ex10.population.individuals[0].geneLength; i++) {
  fittest += ex10.population.getFittest().genes[i];
}

console.log(fittest);
