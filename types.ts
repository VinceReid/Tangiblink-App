
type XOR<T, U> = (T & { [K in keyof U]?: never }) | (U & { [K in keyof T]?: never });

interface PropA {
  propA: string;
}

interface PropB {
  propB: number;
}

type OneOrTheOther = XOR<PropA, PropB>;