const { createFeatureTests } = require("../index");
const { createOneStepTest } = require("./utils/createOneStepTest");
const { configureMockTest } = require("./utils/configureMockTest");

let mockTests;
beforeEach(() => {
  mockTests = configureMockTest();
});

test("steps can be implemented by multiple classes", async () => {
  const log = [];
  class HelloSteps1 {
    givenIAmRunningAGherkinTest() {
      log.push("Given");
    }
  }
  class HelloSteps2 {
    whenIRunTheTest() {
      log.push("When");
    }
  }
  class HelloSteps3 {
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
    [HelloSteps1, HelloSteps2, HelloSteps3]
  );

  await mockTests.run();
  expect(log).toEqual(["Given", "When", "Then"]);
});

test("steps can be nested in any level of array", async () => {
  const log = [];
  class HelloSteps1 {
    givenIAmRunningAGherkinTest() {
      log.push("Given");
    }
  }
  class HelloSteps2 {
    whenIRunTheTest() {
      log.push("When");
    }
  }
  class HelloSteps3 {
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
    [HelloSteps1, [HelloSteps2, [[[HelloSteps3]]]]]
  );

  await mockTests.run();
  expect(log).toEqual(["Given", "When", "Then"]);
});
