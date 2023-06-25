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

test("can inject a class instance while the test is running", async () => {
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

test("can inject a steps instance while the test is running", async () => {
  let helloStepsInstance: HelloSteps;
  let wishedHelloStepsInstance: HelloSteps;

  class HelloSteps {
    givenISayHello() {
      helloStepsInstance = this;
      wishedHelloStepsInstance = wish(HelloSteps);
    }
  }

  createOneStepTest("Given I say hello", [HelloSteps]);

  await mockTests.run();
  expect(helloStepsInstance!).toBe(wishedHelloStepsInstance!);
});

test("cannot inject after the test has ended", async () => {
  class HelloSteps {
    givenISayHello() {}
  }

  createOneStepTest("Given I say hello", [HelloSteps]);

  await mockTests.run();
  expect(() => wish(HelloSteps)).toThrowError(/No current injection context/i);
});

test("each tests have different non-steps injections", async () => {
  const instances: Helper[] = [];

  class Helper {
    sayHello() {
      instances.push(this);
    }
  }

  class HelloSteps {
    givenISayHello() {
      wish(Helper).sayHello();
    }
  }

  createFeatureTests(
    `
    Feature: Hello
      Scenario: Say hello
        Given I say hello

      Scenario: Say hello again
        Given I say hello        
  `,
    [HelloSteps]
  );

  await mockTests.run();

  expect(instances.length).toBe(2);
  expect(instances[0]).toBe(instances[1]);
});

test("steps injected during tests do not handle steps", () => {
  class AppleSteps {
    givenIHaveAnApple() {
      wish(FruitSteps);
    }
  }

  class FruitSteps {
    givenIHaveAFruit() {}
  }

  expect(() => {
    createFeatureTests(
      `
      Feature: Fruits
        Scenario: Eat an apple
          Given I have an apple
          Then I have a fruit
      `,
      [AppleSteps]
    );
  }).toThrow(/There are missing steps/i);
});

test("steps intances injected during tests end with the test", async () => {
  const instances: OtherSteps[] = [];

  class OtherSteps {
    givenISayHelloAgain() {}
  }

  class HelloSteps {
    givenISayHello() {
      instances.push(wish(OtherSteps));
    }
  }

  createFeatureTests(
    `
    Feature: Hello
      Scenario: Say hello
        Given I say hello

      Scenario: Say hello again
        Given I say hello
    `,
    [HelloSteps]
  );

  await mockTests.run();

  expect(instances.length).toBe(2);
  expect(instances[0]).toBe(instances[1]);
});

test("injections in before each ara available in steps", async () => {
  const instances: Helper[] = [];

  class Helper {}

  class HelloSteps {
    beforeEach() {
      instances.push(wish(Helper));
    }

    givenISayHello() {
      instances.push(wish(Helper));
    }
  }

  createOneStepTest("Given I say hello", [HelloSteps]);

  await mockTests.run();

  expect(instances.length).toBe(2);
  expect(instances[0]).toBe(instances[1]);
});

test("injections in after each are the ones in the steps", async () => {
  const instances: Helper[] = [];

  class Helper {}

  class HelloSteps {
    givenISayHello() {
      instances.push(wish(Helper));
    }

    afterEach() {
      instances.push(wish(Helper));
    }
  }

  createOneStepTest("Given I say hello", [HelloSteps]);

  await mockTests.run();

  expect(instances.length).toBe(2);
  expect(instances[0]).toBe(instances[1]);
});

test("two different steps inject the same instances in tests", async () => {
  const instances: Helper[] = [];

  class Helper {}

  class HelloSteps {
    givenISayHello() {
      instances.push(wish(Helper));
    }
  }

  class HelloAgainSteps {
    givenISayHelloAgain() {
      instances.push(wish(Helper));
    }
  }

  createFeatureTests(
    `
    Feature: Hello
      Scenario: Say hello
        Given I say hello
        And I say hello again
    `,
    [HelloSteps, HelloAgainSteps]
  );

  await mockTests.run();

  expect(instances.length).toBe(2);
  expect(instances[0]).toBe(instances[1]);
});
