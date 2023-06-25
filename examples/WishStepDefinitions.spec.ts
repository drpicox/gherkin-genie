import { wish } from "../src";

class AppleSteps {
  #count: number;

  getCount() {
    return this.#count;
  }

  givenIHaveNApples(apples: number) {
    this.#count = apples;
  }
}

class OrangeSteps {
  #count: number;

  getCount() {
    return this.#count;
  }

  givenIHaveNOranges(oranges: number) {
    this.#count = oranges;
  }
}

class FruitSteps {
  #appleSteps: AppleSteps;
  #orangeSteps: OrangeSteps;

  constructor() {
    this.#appleSteps = wish(AppleSteps);
    this.#orangeSteps = wish(OrangeSteps);
  }

  thenIShouldHaveNFruits(fruits: number) {
    const appleCount = this.#appleSteps.getCount();
    const orangeCount = this.#orangeSteps.getCount();
    expect(appleCount + orangeCount).toBe(fruits);
  }
}

// Having all steps in one array
wish("./WishStepDefinitions.feature", [AppleSteps, OrangeSteps, FruitSteps]);

// Having steps grouped in arrays
const appleSteps = [AppleSteps];
const orangeSteps = [OrangeSteps];
const fruitSteps = [FruitSteps, appleSteps, orangeSteps];
wish("./WishStepDefinitions.feature", [fruitSteps]);

// Letting get to automatically find steps
wish("./WishStepDefinitions.feature", [FruitSteps]);
