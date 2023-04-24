import { State, calculate } from "./State";

test("in default state, lotSize is zero", () => {
  const state = new State();
  const result = calculate(state);
  expect(result.lotSize).toEqual(0);
});

test("when anything is unset, return lotSize of zero", () => {
  const state = new State({
    accountBalance: 100000000, // nothing else set
    lotSize: 100, // set from previous state maybe?
  });
  const result = calculate(state);
  expect(result.lotSize).toEqual(0);
});

test("USD -> GJ, with Ask: 167.10", () => {
  const state = new State({
    accountBalance: 1000,
    baseCurrency: "USD",
    pair: "GBPJPY",
    riskPercentage: 5,
    stopLoss: 100,
  });
  const result = calculate(state);
  expect(result.lotSize).toEqual(0.0836);
});
