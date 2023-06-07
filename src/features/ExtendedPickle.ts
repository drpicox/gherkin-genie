import { ExtendedStep } from "./ExtendedStep";

export type ExtendedPickle = {
  id: string;
  uri: string;
  tags: string[];
  name: string;
  fullName: string;
  examples?: string[];
  steps: ExtendedStep[];
  keyword: string;
};
