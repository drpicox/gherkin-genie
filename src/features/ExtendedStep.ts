import { PickleStepArgument } from "@cucumber/messages";

export type ExtendedStep = {
  id: string;
  text: string;
  type: string;
  argument: PickleStepArgument;
  keyword: string;
  matchName: string;
  arguments: (string | number)[];
};
