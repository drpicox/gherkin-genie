const { createFeatureTests, get } = require("../index");
const { createOneStepTest } = require("./utils/createOneStepTest");
const { configureMockTest } = require("./utils/configureMockTest");

let mockTests;
beforeEach(() => {
  mockTests = configureMockTest();
});

test("adding twice the same StepDefinitionsClass ignores the second one", async () => {
  const log = [];
  class HelloSteps {
    givenIAmRunningAGherkinTest() {
      log.push("Hello");
    }
  }

  expect(() =>
    createOneStepTest("Given I am running a gherkin test", [
      HelloSteps,
      HelloSteps,
    ])
  ).not.toThrow();

  await mockTests.run();
  expect(log).toEqual(["Hello"]);
});

test("can get other step instances", async () => {
  const log = [];

  class ApplesSteps {
    count = 0;
    givenIHaveNApples(n) {
      this.count = n;
    }
  }
  class BananasSteps {
    count = 0;
    givenIHaveNBananas(n) {
      this.count = n;
    }
  }
  class FruitSteps {
    #applesSteps;
    #bananasSteps;

    constructor() {
      this.#applesSteps = get(ApplesSteps);
      this.#bananasSteps = get(BananasSteps);
    }

    thenIShouldHaveNFruits(expected) {
      const total = this.#applesSteps.count + this.#bananasSteps.count;
      log.push("Total", total, "Expected", expected);
    }
  }

  createFeatureTests(
    [
      "Feature: Hello World",
      "  Scenario: Hello World",
      "    Given I have 3 apples",
      "    And I have 2 bananas",
      "    Then I should have 5 fruits",
    ].join("\n"),
    [ApplesSteps, BananasSteps, FruitSteps]
  );

  await mockTests.run();
  expect(log).toEqual(["Total", 5, "Expected", 5]);
});

test("it instances StepDefinitionClasses not added but getted", async () => {
  const log = [];

  class ApplesSteps {
    count = 0;
    givenIHaveNApples(n) {
      this.count = n;
    }
  }
  class BananasSteps {
    count = 0;
    givenIHaveNBananas(n) {
      this.count = n;
    }
  }
  class FruitSteps {
    #applesSteps;
    #bananasSteps;

    constructor() {
      this.#applesSteps = get(ApplesSteps);
      this.#bananasSteps = get(BananasSteps);
    }

    thenIShouldHaveNFruits(expected) {
      const total = this.#applesSteps.count + this.#bananasSteps.count;
      log.push("Total", total, "Expected", expected);
    }
  }

  createFeatureTests(
    [
      "Feature: Hello World",
      "  Scenario: Hello World",
      "    Given I have 3 apples",
      "    And I have 2 bananas",
      "    Then I should have 5 fruits",
    ].join("\n"),
    [FruitSteps]
  );

  await mockTests.run();
  expect(log).toEqual(["Total", 5, "Expected", 5]);
});

test("cannot use get outside a constructor", () => {
  class ApplesSteps {}

  expect(() => get(ApplesSteps)).toThrow(
    "You can only use get() inside a StepDefinitionsClass constructor"
  );
});

test("cannot use get before creating tests", () => {
  class ApplesSteps {}
  class FruitSteps {
    constructor() {
      get(ApplesSteps);
    }
  }

  expect(() => new FruitSteps()).toThrow(
    /You can only use get\(\) .* while creating feature tests/
  );
});

test("cannot use get after creating tests", () => {
  class ApplesSteps {}

  createFeatureTests("", [ApplesSteps]);
  expect(() => get(ApplesSteps)).toThrow(
    /You can only use get\(\) .* while creating feature tests/
  );
});

test("cannot get with circular dependencies", () => {
  class ApplesSteps {
    constructor() {
      get(BananasSteps);
    }
  }
  class BananasSteps {
    constructor() {
      get(ApplesSteps);
    }
  }

  expect(() => createFeatureTests("", [ApplesSteps, BananasSteps])).toThrow(
    "Circular dependency detected"
  );
  expect(() => createFeatureTests("", [ApplesSteps, BananasSteps])).toThrow(
    "ApplesSteps -> BananasSteps -> ApplesSteps"
  );
});

test("cannot get itself", () => {
  class ApplesSteps {
    constructor() {
      get(ApplesSteps);
    }
  }

  expect(() => new ApplesSteps()).toThrow("Circular dependency detected");
  expect(() => new ApplesSteps()).toThrow("ApplesSteps -> ApplesSteps");
});
