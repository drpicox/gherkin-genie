const { createOneStepTest } = require("./utils/createOneStepTest");
const { configureMockTest } = require("./utils/configureMockTest");

let mockTests;
beforeEach(() => {
  mockTests = configureMockTest();
});

test("translates numbers into N and gives the value as argument", async () => {
  const log = [];

  class ExampleSteps {
    async givenItHasTheNumberN(n) {
      log.push(n);
    }
  }

  createOneStepTest("Given it has the number 42", [ExampleSteps]);

  await mockTests.run();
  expect(log).toEqual([42]);
});

test.each([0, 137, 0.1, 1.1, 1.4e3, -137, -0.1, -1.1, -1.4e3, -1.4e-3])(
  "translates numbers into $n and gives the value as argument",
  async (n) => {
    const log = [];

    class ExampleSteps {
      async givenItHasTheNumberN(n) {
        log.push(n);
      }
    }

    createOneStepTest(`Given it has the number ${n}`, [ExampleSteps]);

    await mockTests.run();
    expect(log).toEqual([n]);
  }
);
