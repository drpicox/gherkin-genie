/**
 * Converts a step string into a function name and arguments.
 *
 * @param stepStr
 * @returns  the function name and arguments
 */
export function parseStepAndGenerateArguments(stepStr: string): {
  matchName: string;
  args: (string | number)[];
} {
  return new StepParser(stepStr).parse();
}

class StepParser {
  #index = 0;
  #fragments: string[];
  #words: string[] = [];
  #args: (string | number)[] = [];

  constructor(private stepStr: string) {
    this.#fragments = stepStr.split(" ");
  }

  parse(): { matchName: string; args: (string | number)[] } {
    while (this.#hasNext()) {
      if (this.#parseString()) continue;
      if (this.#parseNumber()) continue;
      if (this.#parseWord()) continue;
      this.#parseUnknown();
    }

    const matchName = this.#words.map(capitalize).join("");

    return {
      matchName,
      args: this.#args,
    };
  }

  #parseString() {
    const fragment = this.#peek();
    const start = fragment[0];
    if (start !== "'" && start !== '"') return false;

    let string = this.#next();
    while (this.#hasNext()) {
      if (string.endsWith(start)) {
        if (string.at(-2) !== "\\") break;
        if (/(^|[^\\])(\\\\)+.$/.test(string)) break;
      }
      string += ` ${this.#next()}`;
    }

    this.#args.push(
      string
        .slice(1, -1)
        .replace(/\\(.)/g, (_, char) => escapeCharTable[char] || char)
    );
    this.#words.push("S");

    return true;
  }

  #parseNumber() {
    const fragment = this.#peek();
    if (!isNumber(fragment)) return false;

    this.#args.push(Number(this.#next()));
    this.#words.push("N");
    return true;
  }

  #parseWord() {
    const fragment = this.#peek();
    const word = fragment.normalize("NFD").replace(/([^\w]|\d)/g, "");
    if (!word) return false;

    this.#next();
    this.#words.push(capitalize(word));
    return true;
  }

  #parseUnknown() {
    const fragment = this.#next();
    if (!fragment) return;

    this.#words.push("X");
    this.#args.push(fragment);
  }

  #peek() {
    return this.#fragments[this.#index];
  }

  #next() {
    return this.#fragments[this.#index++];
  }

  #hasNext() {
    return this.#index < this.#fragments.length;
  }
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function isNumber(fragment: string): boolean {
  return fragment && !Number.isNaN(+fragment);
}

const escapeCharTable: Record<string, string> = {
  n: "\n",
  r: "\r",
  t: "\t",
  b: "\b",
  f: "\f",
  v: "\v",
  0: "\0",
  s: " ",
  // "'": "'",
  // '"': '"',
  // "\\": "\\",
};
