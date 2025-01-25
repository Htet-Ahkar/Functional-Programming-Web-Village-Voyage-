export type Compose = <A, B, C>(f: (x: B) => C, g: (x: A) => B) => (x: A) => C;

export const compose: Compose = (f, g) => (x) => f(g(x));
