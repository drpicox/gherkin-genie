import { createFeatureFileTests } from "..";

class ScenarioOutlineSteps {
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

createFeatureFileTests("./ScenarioOutline.feature", [ScenarioOutlineSteps]);
