const { createOneStepTest } = require("./utils/createOneStepTest");
const { configureMockTest } = require("./utils/configureMockTest");

let mockTests;
beforeEach(() => {
  mockTests = configureMockTest();
});

test('translates "strings" encolsed by quotes into S and gives the value as argument', async () => {
  const log = [];

  class ExampleSteps {
    async givenHeSaysS(word) {
      log.push(word);
    }
  }

  createOneStepTest('When he says "HELLO"', [ExampleSteps]);

  await mockTests.run();
  expect(log).toEqual(["HELLO"]);
});

test.each([
  '"HELLO WORLD"',
  "'HELLO WORLD'",
  `"HELLO 'WORLD'"`,
  `'HELLO "WORLD"'`,
  String.raw`"HELLO \"WORLD\""`,
  String.raw`"HELLO \" WORLD \""`,
  String.raw`"HELLO \\"`,
  String.raw`"HELLO \\\" WORLD \""`,
  String.raw`"HELLO \\\\"`,
  String.raw`"HELLO \\\\\" WORLD \""`,
  String.raw`"HELLO \\\\\\"`,
  String.raw`"HELLO\\\\\" WORLD \""`,
  String.raw`"HELLO\\\\\\"`,
  String.raw`"\\\\\" WORLD \""`,
  String.raw`"\\\\\\"`,
  String.raw`'HELLO \'WORLD\''`,
  String.raw`'HELLO \' WORLD \''`,
  String.raw`'HELLO \\'`,
  String.raw`'HELLO \\\' WORLD \''`,
  String.raw`'HELLO \\\\'`,
  String.raw`'HELLO \\\\\' WORLD \''`,
  String.raw`'HELLO \\\\\\'`,
  String.raw`'HELLO\\\\\' WORLD \''`,
  String.raw`'HELLO\\\\\\'`,
  String.raw`'\\\\\' WORLD \''`,
  String.raw`'\\\\\\'`,
  String.raw`"\n\t\r\b\f\v\0\\\"\'"`,
])("translates string into $s and gives the value as argument", async (s) => {
  const log = [];

  class ExampleSteps {
    async givenHeSaysSYesterday(word) {
      log.push(word);
    }
  }

  createOneStepTest(`When he says ${s} yesterday`, [ExampleSteps]);

  await mockTests.run();
  expect(log).toEqual([eval(s)]);
});
