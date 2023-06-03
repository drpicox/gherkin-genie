exports.parseStepAndGenerateArguments = parseStepAndGenerateArguments;

/**
 * Converts a step string into a function name and arguments.
 *
 * @param {string} stepStr
 * @returns {{matchName: string, args: (string | number)[]}} the function name and arguments
 */
function parseStepAndGenerateArguments(stepStr) {
  // Function name generation
  const words = stepStr.match(/\b(\w+)\b|"[^"]+"/g);
  const matchName = words.reduce((acc, word) => {
    if (!Number.isNaN(+word)) {
      acc += "N";
    } else if (/^".+"$/.test(word)) {
      acc += "S";
    } else {
      acc += word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
    return acc;
  }, "");

  // Argument extraction
  const args = [];
  const numbersAndStrings = stepStr.match(/\b\d+\b|"[^"]+"/g);
  if (numbersAndStrings) {
    numbersAndStrings.forEach((element) => {
      if (/^\d+$/.test(element)) {
        args.push(Number(element));
      } else if (/^"[^"]+"$/.test(element)) {
        args.push(element.replace(/"/g, ""));
      }
    });
  }

  return {
    matchName,
    args,
  };
}
