import { ExtendedStep } from "../features/ExtendedStep";
import { StepDefinitions, StepDefinitionsClass } from "../StepDefinitions";
import { StepMethodContext } from "./StepMethodContext";

class CurrentStepDefinitionsContext {}

export const currentStepDefinitionsContext =
  new CurrentStepDefinitionsContext();
