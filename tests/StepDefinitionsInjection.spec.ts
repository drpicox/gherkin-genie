const { createFeatureTests, wish } = require("../index");
const { createOneStepTest } = require("./utils/createOneStepTest");
const { configureMockTest } = require("./utils/configureMockTest");

let mockTests: ReturnType<typeof configureMockTest>;
beforeEach(() => {
  mockTests = configureMockTest();
});

test("adding twice the same StepDefinitionsClass ignores the second one", async () => {
  const log: string[] = [];
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
  const log: (string | number)[] = [];

  class ApplesSteps {
    count = 0;
    givenIHaveNApples(n: number) {
      this.count = n;
    }
  }
  class BananasSteps {
    count = 0;
    givenIHaveNBananas(n: number) {
      this.count = n;
    }
  }
  class FruitSteps {
    #applesSteps: ApplesSteps;
    #bananasSteps: BananasSteps;

    constructor() {
      this.#applesSteps = wish(ApplesSteps);
      this.#bananasSteps = wish(BananasSteps);
    }

    thenIShouldHaveNFruits(expected: number) {
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
  const log: (string | number)[] = [];

  class ApplesSteps {
    count = 0;
    givenIHaveNApples(n: number) {
      this.count = n;
    }
  }
  class BananasSteps {
    count = 0;
    givenIHaveNBananas(n: number) {
      this.count = n;
    }
  }
  class FruitSteps {
    #applesSteps;
    #bananasSteps;

    constructor() {
      this.#applesSteps = wish(ApplesSteps);
      this.#bananasSteps = wish(BananasSteps);
    }

    thenIShouldHaveNFruits(expected: number) {
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

test("cannot use get outside a constructor or a test", () => {
  class ApplesSteps {}

  expect(() => wish(ApplesSteps)).toThrow(/No current injection context/i);
});

test("cannot use get before creating tests", () => {
  class ApplesSteps {}
  class FruitSteps {
    constructor() {
      wish(ApplesSteps);
    }
  }

  expect(() => new FruitSteps()).toThrow(/No current injection context/i);
});

test("cannot use get after creating tests", () => {
  class ApplesSteps {}

  createFeatureTests("", [ApplesSteps]);
  expect(() => wish(ApplesSteps)).toThrow(/No current injection context/i);
});

test("cannot get with circular dependencies", () => {
  class ApplesSteps {
    constructor() {
      wish(BananasSteps);
    }
  }
  class BananasSteps {
    constructor() {
      wish(ApplesSteps);
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
      wish(ApplesSteps);
    }
  }

  expect(() => new ApplesSteps()).toThrow("Circular dependency detected");
  expect(() => new ApplesSteps()).toThrow("ApplesSteps -> ApplesSteps");
});

test("all tests share the same steps injections", async () => {
  let instances: HelloSteps[] = [];

  class HelloSteps {
    givenISayHello() {
      instances.push(this);
    }
  }

  createFeatureTests(
    `
    Feature: Hello
      Scenario: Say hello
        Given I say hello

      Scenario: Say hello again
        Given I say hello        
  `,
    [HelloSteps]
  );

  await mockTests.run();

  expect(instances.length).toBe(2);
  expect(instances[0]).toBe(instances[1]);
});

test("each test from different createTests have different steps injections", async () => {
  let instances: HelloSteps[] = [];

  class HelloSteps {
    givenISayHello() {
      instances.push(this);
    }
  }

  createOneStepTest("Given I say hello", [HelloSteps]);
  createOneStepTest("Given I say hello", [HelloSteps]);

  await mockTests.run();

  expect(instances.length).toBe(2);
  expect(instances[0]).not.toBe(instances[1]);
});
