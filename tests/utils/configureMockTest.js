const { configuration } = require("../../index");

exports.configureMockTest = configureMockTest;

function configureMockTest() {
  const mockTests = new MockTests();
  configuration.setTestFn(mockTests.test.bind(mockTests));
  return mockTests;
}

class MockTests {
  #tests = [];

  test(name, test) {
    this.#tests.push({ name, test });
  }

  async run() {
    for (let i = 0; i < this.#tests.length; i++) {
      const { test } = this.#tests[i];
      await test();
    }
  }

  async runUntilThrow() {
    try {
      await this.run();
    } catch (error) {
      return error;
    }
    throw new Error("Expected an error to be thrown");
  }

  getTestNames() {
    return this.#tests.map(({ name }) => name);
  }
}
