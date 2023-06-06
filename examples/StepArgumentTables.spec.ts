import { createFeatureFileTests } from "../src";

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

createFeatureFileTests("./StepArgumentTables.feature", [ExampleSteps]);
