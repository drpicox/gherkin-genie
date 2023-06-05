# <img src="GHERKIN_GENIE_LOGO.png" width="75" height="75"> Gherkin Genie

> The most simple Gherkin possible.
> Use your favorite test runner.
> Zero regular expressions.
> Code ready to copy and paste.

![DEMO](DEMO.gif)

It is time to stop using complex regular expressions and
wondering which is the best name for our step functions.
With **Gherkin Genie** you will be able to quickly use
gherkins with minimal effort while avoiding gerkins.

See [examples](examples) for more details.

> Background: this engine provides from the needs for my teachings at the University.
> Students were struggling with the regular expressions and the step functions,
> so I decided to create a new approach to the problem.
> This is the 7th iteration over the problem,
> and the improvements are huge, specially when comparing how students
> have improved their skills thanks to this tool.
> See https://github.com/drpicox/classroom--cards-game--2022.

## How to start

0. You already have a test runner like Jest.

> Your test runner does not work by default? Leave an issue and see [Custom test runners](#custom-test-runners).

1. Install the package:

```bash
npm install --save-dev gherkin-genie
```

or with yarn:

```bash
yarn add --dev gherkin-genie
```

2. Create a feature file: Create them into your project and start writing your features.

3. Import the `createFeatureFileTests` function and call it with the path to your feature file:

```ts
import { createFeatureFileTests } from "gherkin-genie";

createFeatureFileTests("./Demo.feature");
```

4. Run your tests:

```bash
npm test
```

Or

```bash
yarn test
```

5. Copy and paste the generated code into your test file. And happy coding!

## Usage

### StepDefinitions

You can create a class with the step definitions:

```feature
# HelloWorld.feature
Feature: Hello World

    Scenario: Running a Gherkin test
        Given I am running a Gherkin test
        When I run the test
        Then I should see the Hello World
```

```ts
class HelloWorldSteps {
  givenIAmRunningAGherkinTest() {
    // ...
  }
  whenIRunTheTest() {
    // ...
  }
  thenIShouldSeeTheHelloWorld() {
    // ...
  }
}
```

And pass it to the `createFeatureFileTests` function:

```ts
import { createFeatureFileTests } from "gherkin-genie";
import { HelloWorldSteps } from "./HelloWorldSteps";

createFeatureFileTests("./HelloWorld.feature", [HelloWorldSteps]);
```

It automatically creates the tests and the gherkin matchers for you.
It creates a test named `Running a Gherkin test`
and maps the steps to the functions in the `HelloWorldSteps` class
as follows:

- `Given I am running a Gherkin test` -> `givenIAmRunningAGherkinTest`
- `When I run the test` -> `whenIRunTheTest`
- `Then I should see the Hello World` -> `thenIShouldSeeTheHelloWorld`

The rules are simple:

- The step name is converted to camel case.
- Spaces are removed.
- Given / When / Then / And / But are removed.
- Numbers and non alphanumeric characters are removed.
- It allows prepend given / when / then / and / but to the method name.

Following [Gherkin conventions](https://cucumber.io/docs/gherkin/reference/#Steps)
keywords are not taken into account when looking for a step definition.
So, any of the following step names will match the `givenIAmRunningAGherkinTest` function:

- `Given I am running a Gherkin test` -> `givenIAmRunningAGherkinTest`
- `When I am running a Gherkin test` -> `givenIAmRunningAGherkinTest`
- `Then I am running a Gherkin test` -> `givenIAmRunningAGherkinTest`
- `And I am running a Gherkin test` -> `givenIAmRunningAGherkinTest`
- `But I am running a Gherkin test` -> `givenIAmRunningAGherkinTest`

### Numbers

Numbers are automatically converted to numbers and passed as a parameter:

```feature
Feature: Magic of Disappearing Cucumbers

    Scenario: Eating 5 out of 12 cucumbers
        Given I have 12 cucumbers
        When I eat 5 cucumbers
        Then I should have 7 cucumbers remaining
```

```ts
class CucumberSteps {
  #count = 0;

  givenIHaveNCucumbers(count: number) {
    this.#count = count;
  }

  whenIEatNCucumbers(eaten: number) {
    this.#count -= eaten;
  }

  thenIShouldHaveNCucumbersRemaining(left: number) {
    expect(this.#count).toBe(left);
  }
}
```

You can see that numbers are replaced by `N` in the method name
and the numeric value is passed as a parameter.

### Strings

Strings are automatically converted to strings and passed as a parameter:

```feature
Feature: Colors and purchases

  Scenario: John buys a red car
    Given "John" likes color "Red"
    When "John" buys a "car"
    Then a "Red" "car" should be sold
```

```ts
class ColorSteps {
  #colors: Record<string, string> = {};
  #items: Record<string, string> = {};

  givenSLikesColorS(name: string, color: string) {
    this.#colors[name] = color;
  }

  whenSBuysAS(name: string, item: string) {
    this.#items[item] = this.#colors[name];
  }

  thenASSShouldBeSold(item: string, color: string) {
    expect(this.#items[item]).toBe(color);
  }
}
```

You can see that strings are replaced by `name` and `item` in the method name
and the string value is passed as a parameter.

Strings are expected to be always between double quotes, and
are replaced by `S` in the method name.

### Custom test runners

By default, **Gherkin Genie** uses the global `test` to create the tests.

If your test runner does not work by default,
because it uses a different name for the test function,
or it expects you to import it,
you can configure it by passing a function to the `configuration.setTestFn` function:

```ts
import test from "ava";
import { configuration } from "gherkin-genie";

configuration.setTestFn(test);
```

## Demo

Feature file:

```feature
Feature: Magic of Disappearing Cucumbers

    Scenario: Eating 5 out of 12 cucumbers
        Given I have 12 cucumbers
        When I eat 5 cucumbers
        Then I should have 7 cucumbers remaining
```

Initial test:

```ts
import { createFeatureFileTests } from "gherkin-genie";

createFeatureFileTests("./Demo.feature");
```

Error message:

```
 FAIL  demo/Demo.spec.ts
  ● Test suite failed to run

    There are missing steps. Please implement them:

    class MissingSteps {
      givenIHaveNCucumbers(number1: number) {
        throw new Error("Unimplemented");
      }

      whenIEatNCucumbers(number1: number) {
        throw new Error("Unimplemented");
      }

      thenIShouldHaveNCucumbersRemaining(number1: number) {
        throw new Error("Unimplemented");
      }
    }

      73 |   if (!missingSteps.length) return;
      74 |
    > 75 |   throw new Error(
         |         ^
      76 |     [
      77 |       "There are missing steps. Please implement them:",
      78 |       "",

      at verifySteps (src/createFeatureTests.js:75:9)
      at createFeatureTests (src/createFeatureTests.js:21:3)
      at createFeatureFileTests (src/createFeatureFileTests.js:21:3)
      at Object.<anonymous> (demo/Demo.spec.ts:19:23)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        0.16 s, estimated 1 s
```

Copy paste and fix implementation:

```ts
import { createFeatureFileTests } from "gherkin-genie";

class CucumberSteps {
  #count = 0;

  givenIHaveNCucumbers(count: number) {
    this.#count = count;
  }

  whenIEatNCucumbers(eaten: number) {
    this.#count -= eaten;
  }

  thenIShouldHaveNCucumbersRemaining(left: number) {
    expect(this.#count).toBe(left);
  }
}

createFeatureFileTests("./Demo.feature", [CucumberSteps]);
```

✨ Done!

![The Gherkin GENIE](GHERKIN_GENIE_LOGO.png)
