const { createFeatureTests } = require("../index");
const { createOneStepTest } = require("./utils/createOneStepTest");
const { configureMockTest } = require("./utils/configureMockTest");

let mockTests;
beforeEach(() => {
  mockTests = configureMockTest();
});

test("can use asyncronous steps", async () => {
  const log = [];
  let count = 1;
  class HelloSteps {
    async beforeEach() {
      log.push(`Before ${count}`);
      await delay(1);
      count++;
    }

    async givenIAmRunningAGherkinTest() {
      log.push(`Given ${count}`);
      await delay(1);
      count++;
    }
    async whenIRunTheTest() {
      log.push(`When ${count}`);
      await delay(1);
      count++;
    }
    async thenIShouldSeeTheHelloWorld() {
      log.push(`Then ${count}`);
      await delay(1);
      count++;
    }

    async afterEach() {
      log.push(`After ${count}`);
      await delay(1);
      count++;
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
  expect(log).toEqual(["Before 1", "Given 2", "When 3", "Then 4", "After 5"]);
  expect(count).toEqual(6);
});

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
