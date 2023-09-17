// Unit test to fix compatibility issues with other test runners
import { getAbsolutePath } from "./readFeatureSync";

const originalError = global.Error;
afterEach(() => {
  global.Error = originalError;
});

test("with parenthesis", () => {
  global.Error = class extends Error {
    constructor(message?: string) {
      super(message);
      this.stack = `Error\n\n\n\n      at Object.<anonymous> (/gherkin-genie/examples/WishInstances.spec.ts:35:5)\n${this.stack}`;
    }
  } as any;

  const path = getAbsolutePath("./features/feature.feature");
  expect(path).toBe("/gherkin-genie/examples/features/feature.feature");
});

test("without parenthesis", () => {
  global.Error = class extends Error {
    constructor(message?: string) {
      super(message);
      this.stack = `Error\n\n\n\n      at /gherkin-genie/examples/WishInstances.spec.ts:35:5\n${this.stack}`;
    }
  } as any;

  const path = getAbsolutePath("./features/feature.feature");
  expect(path).toBe("/gherkin-genie/examples/features/feature.feature");
});
