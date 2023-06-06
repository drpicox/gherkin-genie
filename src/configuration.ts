type TestFn = (feature: string, test: () => void | Promise<void>) => void;

export const configuration = new (class Configuration {
  #testFn: TestFn = global.test;

  getTestFn() {
    return this.#testFn;
  }

  setTestFn(testFn: TestFn) {
    this.#testFn = testFn;
  }
})();
