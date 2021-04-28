interface ConstructorData {
  min?: number;
  max?: number;
  length?: number;
  genes?: number[];
}

class Individual {
  fitness = 0;

  genes: number[] = [];

  geneLength: number;

  constructor({ min, max, length, genes }: ConstructorData) {
    if (min !== undefined && max !== undefined && length !== undefined) {
      this.geneLength = length;

      const number = Math.floor(Math.random() * (max + 1)) + min;
      const binaryString = number.toString(2).split('');

      const binary = binaryString.map(char => Number(char));

      for (let i = 0; i < this.geneLength; i++) {
        if (i < this.geneLength - binary.length) {
          this.genes[i] = 0;
        }
      }

      this.genes = [...this.genes, ...binary];
    }

    if (length !== undefined && genes !== undefined) {
      this.geneLength = length;
      this.genes = genes;
    }

    this.fitness = 0;
  }

  calcFitness(): void {
    const x = parseInt(this.genes.join(''), 2);
    this.fitness = x ** 2 - 4 * x + 6;
  }
}

export default Individual;
