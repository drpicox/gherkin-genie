import { wish } from "../src";

class HelloWorldSteps {
  #message: string;

  givenIAmOnTheHomepage() {
    this.#message = "Hello World";
  }

  thenIShouldSeeS(message: string) {
    expect(this.#message).toBe(message);
  }
}

wish("examples/HelloWorld.feature", [HelloWorldSteps]);
