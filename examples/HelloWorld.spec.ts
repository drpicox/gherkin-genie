import { createFeatureFileTests } from "../src";

class HelloWorldSteps {
  #message: string;

  givenIAmOnTheHomepage() {
    this.#message = "Hello World";
  }

  thenIShouldSeeS(message: string) {
    expect(this.#message).toBe(message);
  }
}

createFeatureFileTests("examples/HelloWorld.feature", [HelloWorldSteps]);
