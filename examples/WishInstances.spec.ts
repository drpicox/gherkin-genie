import { wish } from "../src";

class AppleCounter {
  #count: number = 0;

  add(apples: number) {
    this.#count += apples;
  }

  getCount() {
    return this.#count;
  }
}

class AppleSteps {
  #appleCounter: AppleCounter;

  beforeEach() {
    this.#appleCounter = wish(AppleCounter);
  }

  givenIHaveNApples(apples: number) {
    this.#appleCounter.add(apples);
  }

  givenYouHaveNApples(apples: number) {
    this.#appleCounter.add(apples);
  }

  thenWeShouldHaveNApples(fruits: number) {
    expect(this.#appleCounter.getCount()).toBe(fruits);
  }
}

wish("./WishInstances.feature", [AppleSteps]);
