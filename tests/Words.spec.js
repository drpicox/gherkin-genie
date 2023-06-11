const { createOneStepTest } = require("./utils/createOneStepTest");
const { configureMockTest } = require("./utils/configureMockTest");

let mockTests;
beforeEach(() => {
  mockTests = configureMockTest();
});

test("translates each word into a capitalized one", async () => {
  const log = [];

  class ExampleSteps {
    async givenIDoSomething() {
      log.push("ok");
    }
  }

  createOneStepTest("Given I do something", [ExampleSteps]);

  await mockTests.run();
  expect(log).toEqual(["ok"]);
});

test.each([
  ["I do something", "IDoSomething"],
  ["I Do Something", "IDoSomething"],
  ["I Do SomeThing", "IDoSomething"],
  ["I DO SOMETHING", "IDoSomething"],
  ["I do some-thing", "IDoSomething"],
  ["I do some-Thing", "IDoSomething"],
  ["I do s'omething", "IDoSomething"],
  ["I do somethings'", "IDoSomethings"],
  ["Ï dò sómêthÏng", "IDoSomething"],
])("translates %s into %s", async (s, expected) => {
  const log = [];

  class ExampleSteps {
    async [`given${expected}`]() {
      log.push("ok");
    }
  }

  createOneStepTest(`Given ${s}`, [ExampleSteps]);

  await mockTests.run();
  expect(log).toEqual(["ok"]);
});
