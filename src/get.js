const { StepDefinitionsContext } = require("./utils/StepDefinitionsContext");

/**
 * @template T
 * @param {new () => T} stepDefinitionsClass
 * @returns {T}
 */
exports.get = function get(stepDefinitionsClass) {
  const contextGet = StepDefinitionsContext.get;

  if (!contextGet)
    throw new Error(
      "You can only use get() inside a StepDefinitionsClass constructor while creating feature tests"
    );

  return contextGet(stepDefinitionsClass);
};
