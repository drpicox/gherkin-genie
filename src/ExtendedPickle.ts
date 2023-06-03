export type ExtendedStep = {
  id: string;
  text: string;
  type: string;
  argument: any;
  keyword: string;
  matchName: string;
  arguments: (string | number)[];
};

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
