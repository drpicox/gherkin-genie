const { createOneStepTest } = require("./utils/createOneStepTest");
const { configureMockTest } = require("./utils/configureMockTest");

let mockTests;
beforeEach(() => {
  mockTests = configureMockTest();
});

test("translates unknowns into X and as a parameter", async () => {
  const log = [];

  class ExampleSteps {
    async givenWeirdXStuff(weird) {
      log.push(weird);
    }
  }

  createOneStepTest("Given weird € stuff", [ExampleSteps]);

  await mockTests.run();
  expect(log).toEqual(["€"]);
});

test.each([
  ["weird € stuff", "WeirdXStuff", "€"],
  ["weird $ stuff", "WeirdXStuff", "$"],
  ["weird £ stuff", "WeirdXStuff", "£"],
  ["weird % stuff", "WeirdXStuff", "%"],
  ["weird & stuff", "WeirdXStuff", "&"],
  ["weird  &  stuff", "WeirdXStuff", "&"],
  ["weird !'$·'\"'! stuff", "WeirdXStuff", "!'$·'\"'!"],
  ["weird + stuff", "WeirdXStuff", "+"],
  ["weird - stuff", "WeirdXStuff", "-"],
  ["weird . stuff", "WeirdXStuff", "."],
  ["weird ... stuff", "WeirdXStuff", "..."],
  ["weird 21€ stuff", "WeirdXStuff", "21€"],
  ["weird $15 stuff", "WeirdXStuff", "$15"],
])("translates %s into %s", async (s, expected, param) => {
  const log = [];

  class ExampleSteps {
    async [`given${expected}`](weird) {
      log.push(weird);
    }
  }

  createOneStepTest(`Given ${s}`, [ExampleSteps]);

  await mockTests.run();
  expect(log).toEqual([param]);
});
