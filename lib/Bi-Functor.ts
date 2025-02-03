import { HKT2, Kind2, URIS2, HKT3, Kind3, URIS3 } from "fp-ts/HKT";
import { Either, Left, Right, left, right, eitherMatch } from "./";

interface Bifunctor<F> {
  URI: F;
  bimap: <A, B, C, D>(
    f: (a: A) => C,
    g: (b: B) => D
  ) => (fab: HKT2<F, A, B>) => HKT2<F, C, D>;
}

interface Bifunctor2<F extends URIS2> {
  URI: F;
  bimap: <A, B, C, D>(
    f: (a: A) => C,
    g: (b: B) => D
  ) => (fab: Kind2<F, A, B>) => Kind2<F, C, D>;
}

const eitherBifunctor: Bifunctor2<"Either"> = {
  URI: "Either",
  bimap: (f, g) =>
    eitherMatch(
      (a) => left(f(a)),
      (b) => right(g(b))
    ),
};

type IsEmail = (x: string) => boolean;
const isEmail: IsEmail = (a: string) => a.includes("@");

type ToString = (x: number) => string;
const toString: ToString = (x) => `number is ${x}`;
const lift1 = eitherBifunctor.bimap(isEmail, toString);

type Id = <A>(x: A) => A;
const id: Id = (x) => x;
const lift2 = eitherBifunctor.bimap(id, toString);
