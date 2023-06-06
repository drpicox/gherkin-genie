import { ExtendedPickle } from "../ExtendedPickle";

import * as Gherkin from "@cucumber/gherkin";
import * as Messages from "@cucumber/messages";
import { parseStepAndGenerateArguments } from "./parseStepAndGenerateArguments";

const uuidFn = Messages.IdGenerator.uuid();
const builder = new Gherkin.AstBuilder(uuidFn);
const matcher = new Gherkin.GherkinClassicTokenMatcher(); // or Gherkin.GherkinInMarkdownTokenMatcher()

const parser = new Gherkin.Parser(builder, matcher);

/**
 * Generate the pickles for a given feature.
 *
 * @param feature to compile tests for
 * @returns  the list of pickles
 */
export function compileFeature(feature: string): ExtendedPickle[] {
  const gherkinDocument = parser.parse(feature);
  const pickles = Gherkin.compile(gherkinDocument, "", uuidFn);

  const docNodes = getDocNodesById(gherkinDocument);
  enrichPickles(pickles, docNodes);

  return pickles as any;
}

function getDocNodesById(docNode: any, result: any = {}) {
  // nothing to do
  if (typeof docNode !== "object") return result;

  // process all arrays
  if (Array.isArray(docNode)) {
    docNode.forEach((child) => getDocNodesById(child, result));
    return result;
  }

  // process all children
  Object.values(docNode).forEach((value) => getDocNodesById(value, result));

  // process this node
  if (!docNode.id) return result;
  result[docNode.id] = docNode;

  return result;
}

function enrichPickles(pickles: any, docNodes: any) {
  pickles.forEach((pickle: any) => {
    const cells = findDocNodeField(docNodes, pickle, "cells");
    if (cells) {
      pickle.example = cells.map((cell: any) => cell.value).join(", ");
      pickle.fullName = `${pickle.name} — ${pickle.example}`;
    } else {
      pickle.fullName = pickle.name;
    }

    enrichSteps(pickle.steps, docNodes);
  });
}

function enrichSteps(steps: any, docNodes: any) {
  steps.forEach((step: any) => {
    const { matchName, args } = parseStepAndGenerateArguments(step.text);
    step.keyword = findDocNodeField(docNodes, step, "keyword");
    step.matchName = matchName;
    step.arguments = args;
  });
}

function findDocNodeField(nodes: any, node: any, fieldName: any) {
  if (!node.astNodeIds) return;
  return node.astNodeIds
    .map((id: any) => nodes[id])
    .map((node: any) => node && node[fieldName])
    .find(Boolean);
}
