export class State {
  accountBalance: number;
  baseCurrency: string;
  lotSize: number;
  pair: string;
  riskPercentage: number;
  stopLoss: number;

  constructor() {
    this.accountBalance = 0;
    this.baseCurrency = "";
    this.lotSize = 0;
    this.pair = "";
    this.riskPercentage = 0;
    this.stopLoss = 0;
  }
}

/*
 * dollar_amount_to_risk = balance * (risk_percentage/100)
 * value_per_pip = dollar_amount_to_risk / stop_loss
 * units = value_per_pip * pip_value_ratio
 *
 */
export const calculate = (state: State): State => {
  if (isAnythingUnset(state)) return state;
  return state;
};

const isAnythingUnset = (state: State): State => {
  state.lotSize = 0;
  return state;
};
