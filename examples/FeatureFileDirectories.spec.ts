import { wish, createFeatureFileTests } from "../src";

class HelloWorldSteps {
  #message: string;

  givenIAmOnTheHomepage() {
    this.#message = "Hello World";
  }

  thenIShouldSeeS(message: string) {
    expect(this.#message).toBe(message);
  }
}

// - wish and...
// relative path
wish("./HelloWorld.feature", [HelloWorldSteps]);

// parent relative path
wish("../examples/HelloWorld.feature", [HelloWorldSteps]);

// absolute path
wish("examples/HelloWorld.feature", [HelloWorldSteps]);

// - classic createFeatureFileTests and...

// relative path
createFeatureFileTests("./HelloWorld.feature", [HelloWorldSteps]);

// parent relative path
createFeatureFileTests("../examples/HelloWorld.feature", [HelloWorldSteps]);

// absolute path
createFeatureFileTests("examples/HelloWorld.feature", [HelloWorldSteps]);
