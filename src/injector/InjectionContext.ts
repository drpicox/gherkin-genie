export interface InjectionContext {
  has<T>(InjectionClass: new () => T): boolean;
  get<T>(InjectionClass: new () => T): T;
}
