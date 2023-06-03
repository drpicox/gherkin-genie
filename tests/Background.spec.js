const { createFeatureTests } = require("../index");
const { configureMockTest } = require("./utils/configureMockTest");

let mockTests;
beforeEach(() => {
  mockTests = configureMockTest();
});

test("background is executed by all scenarios", async () => {
  const log = [];
  class HelloSteps {
    #world;
    givenIAmAtS(world) {
      this.#world = world;
    }
    thenIShouldBeAtS(world) {
      log.push(`${this.#world}==${world}`);
    }
    thenIShouldNotBeAtS(world) {
      log.push(`${this.#world}!=${world}`);
    }
  }

  createFeatureTests(
    [
      "Feature: Hello World",
      "  Background:",
      '    Given I am at "Earth"',
      "",
      "  Scenario: My World",
      '    Then I should be at "Earth"',
      "",
      "  Scenario: Not My World",
      '    Then I should not be at "Mars"',
    ].join("\n"),
    [HelloSteps]
  );

  await mockTests.run();
  expect(log).toEqual(["Earth==Earth", "Earth!=Mars"]);
});
