import { wish } from "../src";

class ExampleSteps {
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

wish("./StepArgumentDocStrings.feature", [ExampleSteps]);
