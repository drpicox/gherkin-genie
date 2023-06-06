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

// relative path
createFeatureFileTests("./HelloWorld.feature", [HelloWorldSteps]);

// parent relative path
createFeatureFileTests("../examples/HelloWorld.feature", [HelloWorldSteps]);

// absolute path
createFeatureFileTests("examples/HelloWorld.feature", [HelloWorldSteps]);
