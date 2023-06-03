const { createFeatureTests } = require("../index");
const { configureMockTest } = require("./utils/configureMockTest");

let mockTests;
beforeEach(() => {
  mockTests = configureMockTest();
});

test("Steps receive docStrings", async () => {
  const log = [];
  class HelloSteps {
    givenAText(text) {
      log.push(text);
    }
  }

  createFeatureTests(
    [
      "Feature: Example",
      "  Scenario: Example",
      "    Given a text",
      '    """',
      "    This is a text",
      '    """',
    ].join("\n"),
    [HelloSteps]
  );

  await mockTests.run();
  expect(log).toEqual(["This is a text"]);
});

test("Steps receive dataTables", async () => {
  const log = [];
  class HelloSteps {
    givenATable(table) {
      log.push(...table);
    }
  }

  createFeatureTests(
    [
      "Feature: Example",
      "  Scenario: Example",
      "    Given a table",
      "      | a | b |",
      "      | 1 | 2 |",
      "      | 3 | 4 |",
    ].join("\n"),
    [HelloSteps]
  );

  await mockTests.run();
  expect(log).toEqual([
    { a: "1", b: "2" },
    { a: "3", b: "4" },
  ]);
});
