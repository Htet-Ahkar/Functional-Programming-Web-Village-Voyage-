// Functor
// Functor Option
import { Option, some, none, matchOption, compose } from "./";

type StrLength = (x: string) => number;
const strLength: StrLength = (x) => x.length;

type OptionStrLength = (Fx: Option<string>) => Option<number>;
const optionStrLength: OptionStrLength = matchOption(
  () => none,
  (value: string) => some(strLength(value))
);

type Increment = (x: number) => number;
const increment: Increment = (x) => x + 1;

type OptionIncrement = (Fx: Option<number>) => Option<number>;
const optionIncrement: OptionIncrement = (Fx) =>
  matchOption(
    () => none,
    (value: number) => some(value + 1)
  )(Fx);

type MapOption = <A, B>(f: (x: A) => B) => (Fx: Option<A>) => Option<B>;
const map_option: MapOption = (f) =>
  matchOption(
    () => none,
    (value: Parameters<typeof f>[0]) => some(f(value))
  );

const incrementStrLength = compose(increment, strLength);
const fn1 = compose(map_option(increment), map_option(strLength));
const fn2 = map_option(incrementStrLength);

// List
import { List, cons, nil, match, showList } from "./";
// type ListStrLength = (Fx:List<string>) => List<number>
// type Listincrement = (Fx:List<number>) => List<number>
const list: List<string> = cons("a", cons("bb", cons("ccc", nil)));
const list_number: List<number> = cons(1, cons(2, cons(3, nil)));

type MapList = <A, B>(f: (x: A) => B) => (Fx: List<A>) => List<B>;
const map_list: MapList = (f) =>
  match(
    () => nil,
    (head, tail) => cons(f(head), map_list(f)(tail))
  );

const mapListStrLength = map_list(strLength);
const mapListIncrement = map_list(increment);

// Either
import { Either, left, right, matchEither } from "./";

type MapEither = <A, B, E>(
  f: (x: A) => B
) => (Fx: Either<E, A>) => Either<E, B>;

const map_either: MapEither = (f) =>
  matchEither(
    (e) => left(e),
    (a) => right(f(a))
  );
const mapEitherIncrement = map_either(increment);
