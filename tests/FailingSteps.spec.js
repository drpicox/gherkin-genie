const { createFeatureTests } = require("../index");
const { createOneStepTest } = require("./utils/createOneStepTest");
const { configureMockTest } = require("./utils/configureMockTest");

let mockTests;
beforeEach(() => {
  mockTests = configureMockTest();
});

test("failing afterEachs does not stop execution, but makes fail the test", async () => {
  const log = [];
  class HelloSteps {
    whenItIsAnExample() {
      log.push("When");
    }
  }
  class AfterEach1 {
    afterEach() {
      log.push("AfterEach1");
    }
  }
  class AfterEach2Throws {
    afterEach() {
      log.push("AfterEach2WillThrow");
      throw new Error("AfterEach2Throws");
    }
  }
  class AfterEach3 {
    afterEach() {
      log.push("AfterEach3");
    }
  }

  createOneStepTest("When it is an example", [
    HelloSteps,
    [AfterEach1, AfterEach2Throws, AfterEach3],
  ]);

  const { stack } = await mockTests.runUntilThrow();
  expect(stack).toMatch(/AfterEach2Throws/);
  expect(log).toEqual([
    "When",
    "AfterEach1",
    "AfterEach2WillThrow",
    "AfterEach3",
  ]);
});

test("failing step does not stop afterEachs", async () => {
  const log = [];
  class HelloSteps {
    whenItThrows() {
      log.push("WhenWillThrow");
      throw new Error("WhenThrows");
    }
  }
  class AfterEach {
    afterEach() {
      log.push("AfterEach");
    }
  }

  createOneStepTest("When it throws", [HelloSteps, AfterEach]);

  const { stack } = await mockTests.runUntilThrow();
  expect(stack).toMatch(/WhenThrows/);
  expect(log).toEqual(["WhenWillThrow", "AfterEach"]);
});

test("failing step error prevails over the afterEach", async () => {
  const log = [];
  class HelloSteps {
    whenItThrows() {
      log.push("WhenWillThrow");
      throw new Error("WhenThrows");
    }
  }
  class AfterEach {
    afterEach() {
      log.push("AfterEachWillThrow");
      throw new Error("AfterEachThrows");
    }
  }

  createOneStepTest("When it throws", [HelloSteps, AfterEach]);

  const { stack } = await mockTests.runUntilThrow();
  expect(stack).toMatch(/WhenThrows/);
  expect(log).toEqual(["WhenWillThrow", "AfterEachWillThrow"]);
});

test("failing beforeEach stops next beforeEach and steps", async () => {
  const log = [];
  class HelloSteps {
    whenItIsAnExample() {
      log.push("When");
    }
  }
  class BeforeEach1 {
    beforeEach() {
      log.push("BeforeEach1");
    }
  }
  class BeforeEach2Throws {
    beforeEach() {
      log.push("BeforeEach2WillThrow");
      throw new Error("BeforeEach2Throws");
    }
  }
  class BeforeEach3 {
    beforeEach() {
      log.push("BeforeEach3");
    }
  }

  createOneStepTest("When it is an example", [
    HelloSteps,
    [BeforeEach1, BeforeEach2Throws, BeforeEach3],
  ]);

  const { stack } = await mockTests.runUntilThrow();
  expect(stack).toMatch(/BeforeEach2Throws/);
  expect(log).toEqual(["BeforeEach1", "BeforeEach2WillThrow"]);
});

test("failing beforeEach does not stop afterEachs, but makes fail the test", async () => {
  const log = [];
  class HelloSteps {
    whenItIsAnExample() {
      log.push("When");
    }
  }
  class BeforeEach {
    beforeEach() {
      log.push("BeforeEachWillThrow");
      throw new Error("BeforeEachThrows");
    }
  }
  class AfterEach {
    afterEach() {
      log.push("AfterEach");
    }
  }

  createOneStepTest("When it is an example", [
    HelloSteps,
    [BeforeEach, AfterEach],
  ]);

  const { stack } = await mockTests.runUntilThrow();
  expect(stack).toMatch(/BeforeEachThrows/);
  expect(log).toEqual(["BeforeEachWillThrow", "AfterEach"]);
});
