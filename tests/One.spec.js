const { createFeatureTests } = require("../index");
const { configureMockTest } = require("./utils/configureMockTest");

let mockTests;
beforeEach(() => {
  mockTests = configureMockTest();
});

test("one step", async () => {
  const log = [];
  class HelloSteps {
    givenIAmRunningAGherkinTest() {
      log.push("Given");
    }
  }

  createFeatureTests(
    [
      "Feature: Hello World",
      "  Scenario: Hello World",
      "    Given I am running a gherkin test",
    ].join("\n"),
    [HelloSteps]
  );

  await mockTests.run();
  expect(log).toEqual(["Given"]);
});
