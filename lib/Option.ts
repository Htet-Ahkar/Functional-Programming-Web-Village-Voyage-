import { compose } from "./index";

type Increment = (x: number) => number;
const increment: Increment = (x) => x + 1;

export type Option<A> = Some<A> | None;
export interface Some<A> {
  _tag: "Some";
  value: A;
}
export interface None {
  _tag: "None";
}

export const some = <A>(x: A): Option<A> => ({
  _tag: "Some",
  value: x,
});
export const none: Option<never> = { _tag: "None" };
export const isNone = <A>(x: Option<A>): x is None => x._tag === "None";
// "x is None" is TypeScript: Safeguarding
type DivideTwo = (x: number) => Option<number>;
const divideTwo: DivideTwo = (x) => (x === 0 ? none : some(2 / x));
const composed = compose(
  (x: Option<number>) => (isNone(x) ? none : increment(x.value)),
  divideTwo
);

export type OptionMatch = <A, B>(
  onNone: () => B,
  onSome: (value: A) => B
) => (option: Option<A>) => B;

export const optionMatch: OptionMatch = (onNone, onSome) => (option) =>
  option._tag === "None" ? onNone() : onSome(option.value);
