const { createFeatureTests } = require("../index");
const { createOneStepTest } = require("./utils/createOneStepTest");

describe("when failing from a ts file", () => {
  test("number arguments add the number type", () => {
    let error: any;

    try {
      createOneStepTest("Given I have 3 apples", []);
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    const actualError = error.message;

    expect(actualError).toMatch("givenIHaveNApples(number1: number) {");
  });

  test("string arguments add the string type", () => {
    let error: any;

    try {
      createOneStepTest('Given I have "apples"', []);
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    const actualError = error.message;

    expect(actualError).toMatch(/givenIHaveS\(string1: string\) \{/s);
  });

  test("mixing several add each one its corresponding type", () => {
    let error: any;

    try {
      createOneStepTest('Given I have 2 "apples" and 3 "bananas"', []);
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    const actualError = error.message;

    expect(actualError).toMatch(
      "givenIHaveNSAndNS(number1: number, string1: string, number2: number, string2: string) {"
    );
  });

  test("docstrings arguments are typed as string", () => {
    let error: any;

    try {
      createFeatureTests(
        [
          "Feature: Example",
          "  Scenario: Example",
          "    Given I have a docString",
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

    expect(actualError).toMatch("givenIHaveADocstring(docString: string) {");
  });

  test("tables arguments are typed as Record array", () => {
    let error: any;

    try {
      createFeatureTests(
        [
          "Feature: Example",
          "  Scenario: Example",
          "    Given I have a table",
          "      | a | b |",
          "      | 1 | 2 |",
        ].join("\n"),
        []
      );
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    const actualError = error.message;

    expect(actualError).toMatch(
      "givenIHaveATable(table: { a: string, b: string }[]) {"
    );
  });
});
