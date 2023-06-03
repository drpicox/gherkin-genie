const { createFeatureTests } = require("../index");
const { configureMockTest } = require("./utils/configureMockTest");

let mockTests;
beforeEach(() => {
  mockTests = configureMockTest();
});

test("Scenario Outlines create one test for each Example", async () => {
  const log = [];
  class HelloSteps {
    givenIAmRunningAGherkinTestNumberN(number) {
      log.push(`Given ${number}`);
    }
  }

  createFeatureTests(
    [
      "Feature: Hello World",
      "  Scenario Outline: Hello World",
      "    Given I am running a gherkin test number <number>",
      "    Examples:",
      "      | number |",
      "      | 1      |",
      "      | 2      |",
    ].join("\n"),
    [HelloSteps]
  );

  await mockTests.run();
  expect(log).toEqual(["Given 1", "Given 2"]);
});

test("the name of the scenario outline includes the variable values", async () => {
  class HelloSteps {
    givenThisIsNumberNOfN() {}
  }

  createFeatureTests(
    [
      "Feature: Hello World",
      "  Scenario Outline: Hello World",
      "    Given This is number <number> of <total>",
      "    Examples:",
      "      | number | total |",
      "      | 1      | 2     |",
      "      | 2      | 2     |",
    ].join("\n"),
    [HelloSteps]
  );

  expect(mockTests.getTestNames()).toEqual([
    "Hello World — 1, 2",
    "Hello World — 2, 2",
  ]);
});
