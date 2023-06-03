const { createFeatureTests } = require("../index");
const { createOneStepTest } = require("./utils/createOneStepTest");

test("create tests fails and reports missing steps", () => {
  class HelloSteps {
    givenExistingStep() {}
  }

  let error;
  try {
    createFeatureTests(
      [
        "Feature: Hello World",
        "  Scenario: Hello World",
        "    Given existing step",
        "    When missing step",
        "    Then missing step",
        "    And other missing step",
      ].join("\n"),
      [HelloSteps]
    );
  } catch (e) {
    error = e;
  }

  expect(error).toBeDefined();
  const actualError = error.message;

  expect(actualError).toMatch(/missing steps/s);
  expect(actualError).toMatch(/class MissingSteps \{.*\}/s);
  expect(actualError).toMatch(
    /whenMissingStep\(\) \{\s*throw new Error\(\"Unimplemented\"\);\s*\}/s
  );
  expect(actualError).toMatch(
    /andOtherMissingStep\(\) \{\s*throw new Error\(\"Unimplemented\"\);\s*\}/s
  );
  expect(actualError).not.toMatch(/givenExistingStep/s);
  expect(actualError).not.toMatch(/thenMissingStep/s);
});

test("when having number or string arguments are also suggested", () => {
  let error;

  try {
    createOneStepTest('Given I have 3 "apples" in 2 "carts"', []);
  } catch (e) {
    error = e;
  }

  expect(error).toBeDefined();
  const actualError = error.message;

  expect(actualError).toMatch(
    /givenIHaveNSInNS\(number1, string1, number2, string2\) \{/s
  );
});

test("when having a docString it adds to the end docString", () => {
  let error;

  try {
    createFeatureTests(
      [
        "Feature: Hello World",
        "  Scenario: Hello World",
        "    Given I have a docString",
        '    """',
        "    This is a docString",
        '    """',
        '    Given I have a "big" docString',
        '    """',
        "    This is a docString",
        '    """',
      ].join("\n"),
      []
    );
  } catch (e) {
    error = e;
  }

  expect(error).toBeDefined();
  const actualError = error.message;

  expect(actualError).toMatch(/givenIHaveADocstring\(docString\)/s);
  expect(actualError).toMatch(/givenIHaveASDocstring\(string1, docString\)/s);
});

test("when having a table it adds to the end table", () => {
  let error;

  try {
    createFeatureTests(
      [
        "Feature: Hello World",
        "  Scenario: Hello World",
        "    Given I have a table",
        "      | 1 | 2 | 3 |",
        "      | 4 | 5 | 6 |",
        '     Given I have a "big" table',
        "      | 1 | 2 | 3 |",
        "      | 4 | 5 | 6 |",
      ].join("\n"),
      []
    );
  } catch (e) {
    error = e;
  }

  expect(error).toBeDefined();
  const actualError = error.message;

  expect(actualError).toMatch(/givenIHaveATable\(table\)/s);
  expect(actualError).toMatch(/givenIHaveASTable\(string1, table\)/s);
});
