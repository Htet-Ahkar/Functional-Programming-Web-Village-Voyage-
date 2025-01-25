type FilterFn = <A>(f: (a: A) => boolean) => A[];

function toString<A>(a: A): string {
  return `${a}`;
}

interface Show<A> {
  toString: (a: A) => string;
}

//
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
} from "./lib";

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

interface Functor1<F extends URIS> {
  URI: F;
  map: <A, B>(f: (x: A) => B) => (fa: Kind<F, A>) => Kind<F, B>;
}

interface Functor2<F extends URIS2> {
  URI: F;
  map: <E, A, B>(f: (x: A) => B) => (fa: Kind2<F, E, A>) => Kind2<F, E, B>;
}

const optionFunctor: Functor1<"Option"> = {
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
  F: Functor<F>
): <A, B>(f: (x: A) => B) => (fa: Kind<F, A>) => Kind<F, B>;

function lift<F extends URIS2>(
  F: Functor<F>
): <E, A, B>(f: (x: A) => B) => (fa: Kind2<F, E, A>) => Kind2<F, E, B>;

function lift<F>(
  F: Functor<F>
): <A, B>(f: (x: A) => B) => (fa: HKT<F, A>) => HKT<F, B>;

function lift<F>(
  F: Functor<F>
): <A, B>(f: (x: A) => B) => (fa: HKT<F, A>) => HKT<F, B> {
  return (f) => (fa) => F.map(f)(fa);
}
