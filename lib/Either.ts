export type Either<E, A> = Left<E> | Right<A>;

export interface Left<E> {
  _tag: "Left";
  readonly left: E;
}
export interface Right<A> {
  _tag: "Right";
  readonly right: A;
}

// Helper Functions
export const left = <E, A = never>(e: E): Either<E, A> => ({
  _tag: "Left",
  left: e,
});
export const right = <A, E = never>(a: A): Either<E, A> => ({
  _tag: "Right",
  right: a,
});

export const isLeft = <E, A>(x: Either<E, A>): x is Left<E> =>
  x._tag === "Left";

const divideTwoIfEven = (x: number): Either<string, number> => {
  if (x === 0) {
    return left("Input canot be zero!");
  } else if (x % 2 !== 0) {
    return left("Input is not even.");
  } else {
    return right(2 / x);
  }
};

type Increment = (x: number) => number;
const increment: Increment = (x) => x + 1;

export type EitherMatch = <E, A, B>(
  onLeft: (error: E) => B,
  onRight: (value: A) => B
) => (either: Either<E, A>) => B;

export const eitherMatch: EitherMatch = (onLeft, onRight) => (either) =>
  either._tag === "Left" ? onLeft(either.left) : onRight(either.right);
