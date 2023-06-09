import { wish } from "../src";

class ExampleSteps {
  #cucumbers: number;

  givenThereAreNCucumbers(cucumbers: number) {
    this.#cucumbers = cucumbers;
  }

  whenIEatNCucumbers(eaten: number) {
    this.#cucumbers -= eaten;
  }

  thenIShouldHaveNCucumbers(left: number) {
    expect(this.#cucumbers).toBe(left);
  }
}

wish("./StepArgumentNumbers.feature", [ExampleSteps]);
