const { createFeatureTests, wish } = require("../index");
const { createOneStepTest } = require("./utils/createOneStepTest");
const { configureMockTest } = require("./utils/configureMockTest");

let mockTests: ReturnType<typeof configureMockTest>;
beforeEach(() => {
  mockTests = configureMockTest();
});

test("can inject a class instance", async () => {
  const log: string[] = [];

  class Helper {
    sayHello() {
      log.push("Hello");
    }
  }

  class HelloSteps {
    #helper: Helper;

    constructor() {
      this.#helper = wish(Helper);
    }

    givenISayHello() {
      this.#helper.sayHello();
    }
  }

  createOneStepTest("Given I say hello", [HelloSteps]);

  await mockTests.run();
  expect(log).toEqual(["Hello"]);
});

test.skip("can inject a class instance after the test has started", async () => {
  const log: string[] = [];

  class Helper {
    sayHello() {
      log.push("Hello");
    }
  }

  class HelloSteps {
    givenISayHello() {
      wish(Helper).sayHello();
    }
  }

  createOneStepTest("Given I say hello", [HelloSteps]);

  await mockTests.run();
  expect(log).toEqual(["Hello"]);
});
