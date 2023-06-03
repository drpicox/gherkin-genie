/** @typedef {import("@cucumber/gherkin")} Gherkin */
/** @typedef {import("./StepDefinitionsContext").StepsInstances} StepsInstances */

const chalk = require("chalk");

exports.StepsRunner = class StepsRunner {
  /** @type {StepsInstances} */
  #stepsInstances;

  /** @param {StepsInstances} stepsInstances */
  constructor(stepsInstances) {
    this.#stepsInstances = stepsInstances;
  }

  /** @param {import("../ExtendedPickle").ExtendedPickle} pickle */
  async run(pickle) {
    let firstError;
    let stepIndex = -1;

    try {
      try {
        await this.#stepsInstances.runBeforeEach();

        for (let i = 0; i < pickle.steps.length; i++) {
          stepIndex = i;
          const step = pickle.steps[i];

          let stepArgument;
          if (step.argument?.docString) {
            stepArgument = step.argument.docString.content;
          } else if (step.argument?.dataTable) {
            stepArgument = this.#parseDataTable(step);
          }

          await this.#stepsInstances.runMethod(step, stepArgument);
        }

        stepIndex = pickle.steps.length;
      } catch (error) {
        firstError = error;
      }

      try {
        await this.#stepsInstances.runAfterEach();
      } catch (error) {
        if (!firstError) firstError = error;
      }

      if (firstError) throw firstError;
    } catch (e) {
      this.#decorateError(e, pickle, stepIndex);

      throw e;
    }
  }

  #decorateError(error, pickle, stepIndex) {
    if (!error.stack) return;

    let prettyError = "\n";

    prettyError += `Scenario: ${pickle.fullName}\n`;
    for (let i = 0; i < pickle.steps.length; i++) {
      const step = pickle.steps[i];
      let stepText = `${formatKeyword(step.keyword)}${step.text}`;
      if (i < stepIndex) stepText = chalk.green(" ✔️ " + stepText);
      else if (i === stepIndex) stepText = chalk.red(" ✘ " + stepText);
      else stepText = chalk.gray("   " + stepText);

      if (i - 4 < stepIndex) prettyError += `${stepText}\n`;
    }
    prettyError += "\n";

    error.stack = `${prettyError}\n${error.stack}`;
  }

  #parseDataTable(step) {
    const dataRows = step.argument.dataTable.rows;
    const dataHeader = dataRows[0].cells.map((cell) => cell.value);
    const dataValues = dataRows
      .slice(1)
      .map((row) => row.cells.map((cell) => cell.value));

    const table = [];
    for (let i = 0; i < dataValues.length; i++) {
      const row = dataValues[i];
      const rowObject = {};
      for (let j = 0; j < row.length; j++) {
        const cell = row[j];
        rowObject[dataHeader[j]] = cell;
      }
      table.push(rowObject);
    }

    return table;
  }
};

function formatKeyword(keyword) {
  while (keyword.length < 6) keyword += " ";
  return keyword;
}
