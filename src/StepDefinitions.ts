export type StepMethod = (
  ...args: (string | number | Record<string, string>)[]
) => void | Promise<void>;

export interface StepDefinitions {
  beforeEach?: () => void | Promise<void>;
  afterEach?: () => void | Promise<void>;
}

export type StepDefinitionsClass = new () => any;

export type StepDefinitionsClasses =
  | StepDefinitionsClass
  | StepDefinitionsClasses[];
