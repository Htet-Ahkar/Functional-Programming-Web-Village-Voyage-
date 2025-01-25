export type List<A> = Nil | Cons<A>;
export interface Nil {
  readonly _tag: "Nil";
}
export interface Cons<A> {
  readonly _tag: "Cons";
  readonly head: A;
  readonly tail: List<A>;
}

export const nil: List<never> = { _tag: "Nil" };
export const cons = <A>(head: A, tail: List<A>): List<A> => ({
  _tag: "Cons",
  head,
  tail,
});
export const isNil = <A>(xs: List<A>): xs is Nil => xs._tag === "Nil";
const myList = cons(1, cons(2, cons(3, nil)));

type ShowList = (x: List<number>) => string;
export const showList: ShowList = (xs) =>
  isNil(xs)
    ? ""
    : `${xs.head}` + (isNil(xs.tail) ? "" : `, ${showList(xs.tail)}`);

type Match = <A, B>(
  onNil: () => B,
  onCons: (head: A, tail: List<A>) => B
) => (xs: List<A>) => B;

export const listMatch: Match = (onNil, onCons) => (xs) =>
  isNil(xs) ? onNil() : onCons(xs.head, xs.tail);
