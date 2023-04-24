import { State, calculate } from "./State";

test("in default state, lotSize is zero", () => {
  const state = new State();
  const result = calculate(state);
  expect(result.lotSize).toEqual(0);
});

test("when anything is unset, return lotSize of zero", () => {
  const state = new State();
  state.accountBalance = 100000000; // nothing else set
  state.lotSize = 100; // set from previous state maybe?
  const result = calculate(state);
  expect(result.lotSize).toEqual(0);
});
