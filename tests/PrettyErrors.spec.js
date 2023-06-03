const { createFeatureTests } = require("../index");
const { createOneStepTest } = require("./utils/createOneStepTest");
const { configureMockTest } = require("./utils/configureMockTest");

let mockTests;
beforeEach(() => {
  mockTests = configureMockTest();
});

test("failing step shows the position of the error", async () => {
  class HelloSteps {
    givenIAmRunningAGherkinTest() {}
    whenIFailTheTest() {
      throw new Error("Failing the test");
    }
    thenIShouldSeeTheHelloWorld() {}
  }

  createFeatureTests(
    [
      "Feature: Hello World",
      "  Scenario: Hello World",
      "    Given I am running a gherkin test",
      "    When I fail the test",
      "    Then I should see the Hello World",
    ].join("\n"),
    [HelloSteps]
  );

  const { stack } = await mockTests.runUntilThrow();
  expect(stack).toContain("✔️ Given I am running a gherkin test");
  expect(stack).toContain("✘ When  I fail the test");
  expect(stack).toContain("  Then  I should see the Hello World");
});

test("It only shows three more steps after the failing step", async () => {
  class HelloSteps {
    whenIFailTheTest() {
      throw new Error("Failing the test");
    }
    thenIShouldSeeLineN() {}
    thenIShouldNotSeeLineN() {}
  }

  createFeatureTests(
    [
      "Feature: Example",
      "  Scenario: Example",
      "    When I fail the test",
      "    Then I should see line 1",
      "    And I should see line 2",
      "    And I should see line 3",
      "    But I should not see line 4",
    ].join("\n"),
    [HelloSteps]
  );

  const { stack } = await mockTests.runUntilThrow();
  expect(stack).toContain("✘ When  I fail the test");
  expect(stack).toContain("  Then  I should see line 1");
  expect(stack).toContain("  And   I should see line 2");
  expect(stack).toContain("  And   I should see line 3");
  expect(stack).not.toContain("  But   I should not see line 4");
});

test("If a before each is failing, does not mark first as error", async () => {
  class HelloSteps {
    beforeEach() {
      throw new Error("Failing the test");
    }
    whenIDoAStep() {}
  }

  createFeatureTests(
    ["Feature: Example", "  Scenario: Example", "    When I do a step"].join(
      "\n"
    ),
    [HelloSteps]
  );

  const { stack } = await mockTests.runUntilThrow();
  expect(stack).not.toContain("✔️ I do a step");
  expect(stack).not.toContain("✘ I do a step");
  expect(stack).toContain("  I do a step");
});

test("If an after each is failing, last is not failure", async () => {
  class HelloSteps {
    afterEach() {
      throw new Error("Failing the test");
    }
    whenIDoAStep() {}
  }

  createFeatureTests(
    ["Feature: Example", "  Scenario: Example", "    When I do a step"].join(
      "\n"
    ),
    [HelloSteps]
  );

  const { stack } = await mockTests.runUntilThrow();
  expect(stack).toContain("✔️ When  I do a step");
  expect(stack).not.toContain("✘ When  I do a step");
});
