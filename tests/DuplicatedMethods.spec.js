const { createOneStepTest } = require("./utils/createOneStepTest");
const { configureMockTest } = require("./utils/configureMockTest");

let mockTests;
beforeEach(() => {
  mockTests = configureMockTest();
});

test("create tests fails if two steps objects implements the same step", () => {
  class HelloSteps {
    givenIAmRunningAGherkinTest() {}
  }
  class WorldSteps {
    thenIAmRunningAGherkinTest() {}
  }

  expect(() =>
    createOneStepTest("Given I am running a gherkin test", [
      HelloSteps,
      WorldSteps,
    ])
  ).toThrow(
    /Duplicate.*"\*IAmRunningAGherkinTest".*HelloSteps.givenIAmRunningAGherkinTest.*WorldSteps.thenIAmRunningAGherkinTest/s
  );
});
