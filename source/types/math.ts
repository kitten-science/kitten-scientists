export type Math = {
  new (): Math;
  uniformRandomInteger: (min: number, max: number) => number;
  standardGaussianRandom: () => number;
  irwinHallRandom: (trials: number) => number;
  binominalRandomInteger: (trials: number, successProbability: number) => number;
  loopOrGaussianApproximation: (
    trials: number,
    isDiscrete: boolean,
    mean: number,
    variance: number,
    lowerBound: number,
    upperBound: number,
    baseDistribution: () => number,
  ) => number;
  log1p: (p: number) => number;
};
