// ADT, Pattern Matching

// List
import { List, match } from ".";

type AddAll = (xs: List<number>) => number;

const addAll: AddAll = match(
  () => 0,
  (head: number, tail: List<number>) => head + addAll(tail)
);

type MultiplyAll = (xs: List<number>) => number;

const multiplyAll: MultiplyAll = match(
  () => 1,
  (head: number, tail: List<number>) => head * multiplyAll(tail)
);

type AppendAll = (xs: List<string>) => string;
const appendAll: AppendAll = match(
  () => "",
  (head: string, tail: List<string>) => head + appendAll(tail)
);

// Magma, Semigroup
interface Magma<A> {
  concat: (x: A, y: A) => A;
}
interface Semigroup<A> extends Magma<A> {}

const addSemiGroup: Semigroup<number> = { concat: (x, y) => x + y };
const multiplySemiGroup: Semigroup<number> = { concat: (x, y) => x * y };
const appendSemiGroup: Semigroup<string> = { concat: (x, y) => x + y };

const concatAllSemigroup =
  <A>(s: Semigroup<A>) =>
  (startWith: A) =>
  (xs: List<A>): A =>
    match(
      () => startWith,
      (head: A, tail: List<A>) =>
        s.concat(head, concatAllSemigroup(s)(startWith)(tail))
    )(xs);

// Monoid
export interface Monoid<A> extends Semigroup<A> {
  empty: A;
}

const addMonoid: Monoid<number> = { ...addSemiGroup, empty: 0 };
const multiplyMonoid: Monoid<number> = { ...multiplySemiGroup, empty: 1 };
const appendMonoid: Monoid<string> = { ...appendSemiGroup, empty: "" };

const concatAllMonoid =
  <A>(m: Monoid<A>) =>
  (xs: List<A>): A =>
    match(
      () => m.empty,
      (head: A, tail: List<A>) => m.concat(head, concatAllMonoid(m)(tail))
    )(xs);

// Group
interface Group<A> extends Monoid<A> {
  inverse: (a: A) => A;
}

const addGroup: Group<number> = {
  concat: (x, y) => x + y,
  empty: 0,
  inverse: (a) => -a,
};

const walletBalance = addGroup.concat(
  addGroup.empty,
  addGroup.concat(80, addGroup.concat(20, addGroup.inverse(10)))
);

// Caesar Cipher
type Encript = (plainText: string, key: number) => string;
type Decript = (cipherText: string, key: number) => string;

const alphabets = "abcdefghijklmnopqrstuvwxyz";
// const alphabets = "tbcdefgihjlkmnzpqrsauvoxyw";

const caesarGroup: Group<number> = {
  concat: (x, y) => (x + y) % alphabets.length,
  empty: 0,
  inverse: (a) => (alphabets.length - a) % alphabets.length,
};

const encriptText: Encript = (plainText, key) =>
  plainText
    .toLowerCase()
    .split("")
    .map((c) => {
      const index = alphabets.indexOf(c);
      if (index === -1) return c;

      const newIndex = caesarGroup.concat(index, key);
      return alphabets[newIndex];
    })
    .join("");

const decriptText: Decript = (cipherText, key) =>
  encriptText(cipherText, caesarGroup.inverse(key));
