/** @typedef {(feature: string, test: () => void | Promise<void>) => void} TestFn */

exports.configuration = new (class Configuration {
  /** @type {TestFn} */
  #testFn = global.test;

  getTestFn() {
    return this.#testFn;
  }

  setTestFn(testFn) {
    this.#testFn = testFn;
  }
})();
