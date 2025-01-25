// List
import { List, Nil, nil, Cons, cons, isNil } from "./";

export type Match = <A, B>(
  onNil: () => B,
  onCons: (head: A, tail: List<A>) => B
) => (xs: List<A>) => B;
export const match: Match = (onNil, onCons) => (xs) =>
  isNil(xs) ? onNil() : onCons(xs.head, xs.tail);
