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

<!-- toc -->

- [How to start](#how-to-start)
- [Usage](#usage)
  * [Steps](#steps)
  * [Numbers](#numbers)
  * [Strings](#strings)
  * [Doc Strings](#doc-strings)
  * [Tables](#tables)
  * [Scenario Outlines](#scenario-outlines)
- [Using Other Step Definitions](#using-other-step-definitions)
  * [Using multiple step definitions](#using-multiple-step-definitions)
  * [Getting other step definitions](#getting-other-step-definitions)
  * [Auto-injecting other step definitions](#auto-injecting-other-step-definitions)
  * [`get` restriction](#get-restriction)
- [Configuration](#configuration)
  * [Custom test runners](#custom-test-runners)
- [Demo](#demo)

<!-- tocstop -->

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

## Usage

### Steps

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

### Doc Strings

Doc strings are automatically converted to strings and passed as the parameter:

```feature
Feature: Blog posts

  Scenario: John creates a post
    Given a blog post named "Random" with Markdown body
        """
        Some Title, Eh?
        ===============
        Here is the first paragraph of my blog post. Lorem ipsum dolor sit amet,
        consectetur adipiscing elit.
        """
    Then the blog post should be titled "Random"
    And the blog post body should contain "Here is the first paragraph"
```

```ts
class PostSteps {
  #title: string;
  #body: string;

  givenABlogPostNamedSWithMarkdownBody(title: string, docString: string) {
    this.#title = title;
    this.#body = docString;
  }

  thenTheBlogPostShouldBeTitledS(title: string) {
    expect(this.#title).toBe(title);
  }

  andTheBlogPostBodyShouldContainS(body: string) {
    expect(this.#body).toContain(body);
  }
}
```

### Tables

Tables are automatically converted to arrays of objects and passed as the last parameter:

```feature
Feature: User handles

    Scenario: Users have twitter handles
        Given the following users exist:
            | name   | email              | twitter         |
            | Aslak  | aslak@cucumber.io  | @aslak_hellesoy |
            | Julien | julien@cucumber.io | @jbpros         |
            | Matt   | matt@cucumber.io   | @mattwynne      |
        Then the user "Aslak" should have the twitter handle "@aslak_hellesoy"
        And the user "Julien" should have the twitter handle "@jbpros"
        And the user "Matt" should have the twitter handle "@mattwynne"
```

```ts
type TableEntry = { name: string; email: string; twitter: string };

class ExampleSteps {
  #table: TableEntry[];

  givenTheFollowingUsersExist(table: TableEntry[]) {
    this.#table = table;
  }

  thenTheUserSShouldHaveTheTwitterHandleS(username: string, twitter: string) {
    const user = this.#table.find((user) => user.name === username);
    expect(user!.twitter).toBe(twitter);
  }
}
```

> Please not that TableEntry typing is suggested directly as table parameter type,
> but for simplicity it has been extracted by a simple IDE refactor to a type alias.

### Scenario Outlines

Scenario outlines are automatically converted to multiple tests:

```feature
Feature: Scenario Outline

    Scenario Outline: Eating cucumbers
        Given there are <start> cucumbers
        When I eat <eat> cucumbers
        Then I should have <left> cucumbers

        Examples:
            | start | eat | left |
            | 12    | 5   | 7    |
            | 20    | 5   | 15   |
```

```ts
class CucumberSteps {
  #count = 0;

  givenThereAreNCucumbers(count: number) {
    this.#count = count;
  }

  whenIEatNCucumbers(eaten: number) {
    this.#count -= eaten;
  }

  thenIShouldHaveNCucumbers(left: number) {
    expect(this.#count).toBe(left);
  }
}
```

Please note that the CucumberSteps class is the same as the one used in the [Numbers](#numbers) section.
Variables are automatically replaced inside the sentences.

With Scenario Outlines, instead of creating one test, it creates one test per example.
And it also includes the variable values in the test name:

- `Eating cucumbers — 12, 5, 7`
- `Eating cucumbers — 20, 5, 15`

## Using Other Step Definitions

In large projects, often one single class implementing all the step definitions is not enough.
And it also not recommended to have a new class for each feature file.
But, we can create a collection of own step definitions classes and use them in multiple feature files.

### Using multiple step definitions

You can pass multiple step definitions to the `createFeatureFileTests` function:

```ts
import { createFeatureFileTests } from "gherkin-genie";
import { AppleSteps } from "./AppleSteps";
import { OrangeSteps } from "./OrangeSteps";
import { FruitSteps } from "./FruitSteps";

createFeatureFileTests("./Fruits.feature", [
  AppleSteps,
  OrangeSteps,
  FruitSteps,
]);
```

In this case, the step definitions are merged together.

### Getting other step definitions

You can get the step definitions instances by using the `get` function.
It allows you to use them in other steps.

For example, given:

```ts
// "AppleSteps.ts"
export class AppleSteps {
  #count: number;

  getCount() {
    return this.#count;
  }

  givenIHaveNApples(apples: number) {
    this.#count = apples;
  }
}
```

Assuming that `OrangeSteps` is similar to `AppleSteps`,
`FruitSteps` can use them as follows:

```ts
// "FruitSteps.ts"
import { get } from "gherkin-genie";
import { AppleSteps } from "./AppleSteps";
import { OrangeSteps } from "./OrangeSteps";

class FruitSteps {
  #appleSteps: AppleSteps;
  #orangeSteps: OrangeSteps;

  constructor() {
    this.#appleSteps = get(AppleSteps);
    this.#orangeSteps = get(OrangeSteps);
  }

  thenIShouldHaveNFruits(fruits: number) {
    const appleCount = this.#appleSteps.getCount();
    const orangeCount = this.#orangeSteps.getCount();
    expect(appleCount + orangeCount).toBe(fruits);
  }
}
```

### Auto-injecting other step definitions

Although in the first example we have manually injected several
step definitions classes into the `createFeatureFileTests` function,
it is possible to auto-inject them.

When the `createFeatureFileTests` function is called,
it will instance all the step definitions obtained by the `get` function,
and add them to the list of step definitions.

```feature
Feature: Fruits

  Scenario: We can mix several fruits
    Given I have 3 apples
    And I have 2 oranges
    Then I should have 5 fruits
```

```ts
import { createFeatureFileTests } from "gherkin-genie";
import { FruitSteps } from "./FruitSteps";

createFeatureFileTests("./Fruits.feature", [FruitSteps]);
```

Because FruitSteps uses the `get` function to obtain
the `AppleSteps` and `OrangeSteps` instances,
their step definitions are automatically injected into the test.

### `get` restriction

The `get` function only works inside the class constructor, and only
while the class is being instantiated by the `createFeatureFileTests` function.

It is not possible to use the `get` function in the step definitions methods.

```ts
// ❌ WRONG "FruitSteps.ts"
import { get } from "gherkin-genie";
import { AppleSteps } from "./AppleSteps";
import { OrangeSteps } from "./OrangeSteps";

class FruitSteps {
  thenIShouldHaveNFruits(fruits: number) {
    const appleCount = get(AppleSteps).getCount();
    const orangeCount = get(OrangeSteps).getCount();
    expect(appleCount + orangeCount).toBe(fruits);
  }
}
```

This will throw an error.

## Configuration

It is possible configure the function `test` to be used to create the tests.

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
