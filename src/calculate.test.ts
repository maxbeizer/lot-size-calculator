import calculatePositionSize from "./calculate";

test("Base USD: EUR/CAD", () => {
  const { positionSize, pipValue, lotSize } = calculatePositionSize({
    accountBalance: 10000,
    riskPercentage: 1,
    stopLossPips: 10,
    baseCurrency: "USD",
    quoteCurrency: "CAD",
    askPrice: 1.4706,
    bidPrice: 1.471,
  });

  expect(positionSize).toBe(147060);
  expect(pipValue).toBe(14.71);
  expect(lotSize).toBe(1.4706);
});

test("Base USD: GBP/AUD", () => {
  const { positionSize, pipValue, lotSize } = calculatePositionSize({
    accountBalance: 10000,
    riskPercentage: 1,
    stopLossPips: 10,
    baseCurrency: "USD",
    quoteCurrency: "AUD",
    askPrice: 0.6646,
    bidPrice: 0.6638,
  });

  expect(positionSize).toBe(150647.7855);
  expect(pipValue).toBe(15.06);
  expect(lotSize).toBe(1.5065);
});

test("Base USD: GBP/JPY", () => {
  const { positionSize, pipValue, lotSize } = calculatePositionSize({
    accountBalance: 10000,
    riskPercentage: 1,
    stopLossPips: 10,
    baseCurrency: "USD",
    quoteCurrency: "JPY",
    askPrice: 134.17,
    bidPrice: 134.15,
  });

  expect(positionSize).toBe(134170);
  expect(pipValue).toBe(1341.7);
  expect(lotSize).toBe(1.3417);
});
