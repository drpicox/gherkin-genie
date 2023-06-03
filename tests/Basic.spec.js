const { createFeatureTests } = require("../index");
const { createOneStepTest } = require("./utils/createOneStepTest");
const { configureMockTest } = require("./utils/configureMockTest");

let mockTests;
beforeEach(() => {
  mockTests = configureMockTest();
});

test("hello world", async () => {
  const log = [];
  class HelloSteps {
    givenIAmRunningAGherkinTest() {
      log.push("Given");
    }
    whenIRunTheTest() {
      log.push("When");
    }
    thenIShouldSeeTheHelloWorld() {
      log.push("Then");
    }
  }

  createFeatureTests(
    [
      "Feature: Hello World",
      "  Scenario: Hello World",
      "    Given I am running a gherkin test",
      "    When I run the test",
      "    Then I should see the Hello World",
    ].join("\n"),
    [HelloSteps]
  );

  await mockTests.run();
  expect(log).toEqual(["Given", "When", "Then"]);
});

test("Example is synonimous of Scenario", async () => {
  const log = [];
  class HelloSteps {
    givenIAmRunningAGherkinTest() {
      log.push("Given");
    }
    whenIRunTheTest() {
      log.push("When");
    }
    thenIShouldSeeTheHelloWorld() {
      log.push("Then");
    }
  }

  createFeatureTests(
    [
      "Feature: Hello World",
      "  Example: Hello World",
      "    Given I am running a gherkin test",
      "    When I run the test",
      "    Then I should see the Hello World",
    ].join("\n"),
    [HelloSteps]
  );

  await mockTests.run();
  expect(log).toEqual(["Given", "When", "Then"]);
});

test("given, when, or then are not relevant", async () => {
  const log = [];

  class ExampleSteps {
    async whenItIsAnExample() {
      log.push("ItIsAnExample");
    }

    async thenItExecutes() {
      log.push("ItExecutes");
    }

    async givenItShouldBeExecuted() {
      log.push("ItShouldBeExecuted");
    }
  }

  createFeatureTests(
    [
      "Feature: Example",
      "  Scenario: First",
      "    Given it is an example",
      "    When it executes",
      "    Then it should be executed",
    ].join("\n"),
    [ExampleSteps]
  );

  await mockTests.run();
  expect(log).toEqual(["ItIsAnExample", "ItExecutes", "ItShouldBeExecuted"]);
});

test('it also accepts "and" and "but"', async () => {
  const log = [];

  class ExampleSteps {
    async givenItIsAnExample() {
      log.push("ItIsAnExample");
    }

    async andItExecutes() {
      log.push("ItExecutes");
    }

    async butItShouldBeExecuted() {
      log.push("ItShouldBeExecuted");
    }
  }

  createFeatureTests(
    [
      "Feature: Example",
      "  Scenario: First",
      "    Given it is an example",
      "    And it executes",
      "    But it should be executed",
    ].join("\n"),
    [ExampleSteps]
  );

  await mockTests.run();
  expect(log).toEqual(["ItIsAnExample", "ItExecutes", "ItShouldBeExecuted"]);
});

test("but it does not work without any of the prefixes", async () => {
  class ExampleSteps {
    itIsAnExample() {}
    ItIsAnExample() {}
    otherItIsAnExample() {}
  }

  expect(() => {
    createOneStepTest("When it is an example", [ExampleSteps]);
  }).toThrow(/ItIsAnExample/);
});

test("it executes beforeEach and afterEach", async () => {
  const log = [];

  class ExampleSteps {
    beforeEach() {
      log.push("Before");
    }

    afterEach() {
      log.push("After");
    }

    givenItIsAnExample() {
      log.push("Given");
    }
  }

  createOneStepTest("Given it is an example", [ExampleSteps]);

  await mockTests.run();
  expect(log).toEqual(["Before", "Given", "After"]);
});

test("translates numbers into N and gives the value as argument", async () => {
  const log = [];

  class ExampleSteps {
    async givenItHasTheNumberN(n) {
      log.push(n);
    }
  }

  createOneStepTest("Given it has the number 42", [ExampleSteps]);

  await mockTests.run();
  expect(log).toEqual([42]);
});

test('translates "strings" encolsed by quotes into S and gives the value as argument', async () => {
  const log = [];

  class ExampleSteps {
    async givenHeSaysS(word) {
      log.push(word);
    }
  }

  createOneStepTest('When he says "HELLO"', [ExampleSteps]);

  await mockTests.run();
  expect(log).toEqual(["HELLO"]);
});

test("combines numbers and strings", async () => {
  const log = [];

  class ExampleSteps {
    async givenIHaveNSCarsWithNDoors(...args) {
      log.push(...args);
    }
  }

  createOneStepTest('Given I have 2 "red" cars with 4 doors', [ExampleSteps]);

  await mockTests.run();
  expect(log).toEqual([2, "red", 4]);
});
