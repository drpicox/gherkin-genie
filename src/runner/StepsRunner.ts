import { StepDefinitionsContext } from "../injector/StepDefinitionsContext";
import { ExtendedPickle } from "../features/ExtendedPickle";
import { ExtendedStep } from "../features/ExtendedStep";

const chalk = require("chalk");

export class StepsRunner {
  #stepsInstances: StepDefinitionsContext;

  constructor(stepsInstances: StepDefinitionsContext) {
    this.#stepsInstances = stepsInstances;
  }

  async run(pickle: ExtendedPickle) {
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

  #decorateError(error: Error, pickle: ExtendedPickle, stepIndex: number) {
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

  #parseDataTable(step: ExtendedStep) {
    const dataRows = step.argument.dataTable.rows;
    const dataHeader = dataRows[0].cells.map((cell: any) => cell.value);
    const dataValues = dataRows
      .slice(1)
      .map((row: any) => row.cells.map((cell: any) => cell.value));

    const table = [];
    for (let i = 0; i < dataValues.length; i++) {
      const row = dataValues[i];
      const rowObject: any = {};
      for (let j = 0; j < row.length; j++) {
        const cell = row[j];
        rowObject[dataHeader[j]] = cell;
      }
      table.push(rowObject);
    }

    return table;
  }
}

function formatKeyword(keyword: string) {
  while (keyword.length < 6) keyword += " ";
  return keyword;
}
