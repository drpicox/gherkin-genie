import { wish } from "../src";

class ExampleSteps {
  #favoriteColors: { [user: string]: string } = {};
  #purchases: { [user: string]: { purchase: string; color: string } } = {};

  givenSLikesColorS(user: string, color: string) {
    this.#favoriteColors[user] = color;
  }

  whenSBuysAS(user: string, purchase: string) {
    const color = this.#favoriteColors[user];
    this.#purchases[user] = { purchase, color };
  }

  thenSShouldHaveASS(user: string, color: string, purchase: string) {
    const purchaseRecord = this.#purchases[user];
    expect(purchaseRecord.color).toBe(color);
    expect(purchaseRecord.purchase).toBe(purchase);
  }
}

wish("./StepArgumentStrings.feature", [ExampleSteps]);
