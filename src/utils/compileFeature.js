exports.compileFeature = compileFeature;

const Gherkin = require("@cucumber/gherkin");
const Messages = require("@cucumber/messages");
const {
  parseStepAndGenerateArguments,
} = require("./parseStepAndGenerateArguments");

const uuidFn = Messages.IdGenerator.uuid();
const builder = new Gherkin.AstBuilder(uuidFn);
const matcher = new Gherkin.GherkinClassicTokenMatcher(); // or Gherkin.GherkinInMarkdownTokenMatcher()

const parser = new Gherkin.Parser(builder, matcher);

/**
 * Generate the pickles for a given feature.
 *
 * @param {string} feature to compile tests for
 * @returns {ReturnType<typeof Gherkin.compile>} the list of pickles
 */
function compileFeature(feature) {
  const gherkinDocument = parser.parse(feature);
  const pickles = Gherkin.compile(gherkinDocument, "", uuidFn);

  const docNodes = getDocNodesById(gherkinDocument);
  enrichPickles(pickles, docNodes);

  return pickles;
}

function getDocNodesById(docNode, result = {}) {
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

function enrichPickles(pickles, docNodes) {
  pickles.forEach((pickle) => {
    const cells = findDocNodeField(docNodes, pickle, "cells");
    if (cells) {
      pickle.example = cells.map((cell) => cell.value).join(", ");
      pickle.fullName = `${pickle.name} — ${pickle.example}`;
    } else {
      pickle.fullName = pickle.name;
    }

    enrichSteps(pickle.steps, docNodes);
  });
}

function enrichSteps(steps, docNodes) {
  steps.forEach((step) => {
    const { matchName, args } = parseStepAndGenerateArguments(step.text);
    step.keyword = findDocNodeField(docNodes, step, "keyword");
    step.matchName = matchName;
    step.arguments = args;
  });
}

function findDocNodeField(nodes, node, fieldName) {
  if (!node.astNodeIds) return;
  return node.astNodeIds
    .map((id) => nodes[id])
    .map((node) => node && node[fieldName])
    .find(Boolean);
}
