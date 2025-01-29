// Type Class
import { HKT, Kind, Kind2, URIS, URIS2 } from "fp-ts/HKT";
import {
  List,
  cons,
  nil,
  listMatch,
  Option,
  some,
  none,
  optionMatch,
  Either,
  right,
  left,
  eitherMatch,
} from "./";

declare module "fp-ts/HKT" {
  interface URItoKind<A> {
    List: List<A>;
    Option: Option<A>;
  }
  interface URItoKind2<E, A> {
    Either: Either<E, A>;
  }
}

interface Functor<F> {
  map: <A, B>(f: (x: A) => B) => (fa: HKT<F, A>) => HKT<F, B>;
}

export interface Functor1<F extends URIS> {
  URI: F;
  map: <A, B>(f: (x: A) => B) => (fa: Kind<F, A>) => Kind<F, B>;
}

interface Functor2<F extends URIS2> {
  URI: F;
  map: <E, A, B>(f: (x: A) => B) => (fa: Kind2<F, E, A>) => Kind2<F, E, B>;
}

export const listFunctor: Functor1<"List"> = {
  URI: "List",
  map: (f) =>
    listMatch(
      () => nil,
      (head, tail) => cons(f(head), listFunctor.map(f)(tail))
    ),
};

export const optionFunctor: Functor1<"Option"> = {
  URI: "Option",
  map: (f) =>
    optionMatch(
      () => none,
      (a) => some(f(a))
    ),
};

const eitherFunctor: Functor2<"Either"> = {
  URI: "Either",
  map: (f) =>
    eitherMatch(
      (e) => left(e),
      (a) => right(f(a))
    ),
};

function lift<F extends URIS>(
  F: Functor1<F>
): <A, B>(f: (x: A) => B) => (fa: Kind<F, A>) => Kind<F, B>;

function lift<F extends URIS2>(
  F: Functor2<F>
): <E, A, B>(f: (x: A) => B) => (fa: Kind2<F, E, A>) => Kind2<F, E, B>;

function lift<F>(
  F: Functor<F>
): <A, B>(f: (x: A) => B) => (fa: HKT<F, A>) => HKT<F, B>;

function lift<F>(
  F: Functor<F>
): <A, B>(f: (x: A) => B) => (fa: HKT<F, A>) => HKT<F, B> {
  return (f) => (fa) => F.map(f)(fa);
}

type Increment = (x: number) => number;
const increment: Increment = (x) => x + 1;

const liftIncrement = lift(optionFunctor)(increment);

const liftIncrement2 = lift(eitherFunctor)(increment);

const liftIncrement3 = lift(listFunctor)(increment);
