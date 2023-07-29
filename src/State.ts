import { BASE_CURRENCIES } from "./constants";
import calculatePositionSize, { buildCalculateInput } from "./calculate";

const EXCHANGE_RATE_URL = "https://api.exchangerate.host/latest";
export class State {
  accountBalance: number;
  baseCurrency: string;
  quoteCurrency: string;
  lotSize: number;
  pair: string;
  riskPercentage: number;
  stopLossPips: number;
  bidPrice: number;
  askPrice: number;

  // TODO: add properties for current ask prices for all the pairs and store them
  // on the state object with some sort of TTL?
  constructor({
    accountBalance = 0,
    baseCurrency = "",
    quoteCurrency = "",
    lotSize = 0,
    pair = "",
    riskPercentage = 0,
    stopLossPips = 0,
    bidPrice = 0,
    askPrice = 0,
  } = {}) {
    this.accountBalance = accountBalance;
    this.baseCurrency = baseCurrency;
    this.quoteCurrency = quoteCurrency;
    this.lotSize = lotSize;
    this.pair = pair;
    this.riskPercentage = riskPercentage;
    this.stopLossPips = stopLossPips;
    this.bidPrice = bidPrice;
    this.askPrice = askPrice;
  }
}

/*
 * dollar_amount_to_risk = balance * (risk_percentage/100)
 * value_per_pip = dollar_amount_to_risk / stop_loss
 * units = value_per_pip * pip_value_ratio
 *
 */
export const buildState = (state: State): State => {
  fetchExchangeRates(state);
  const { lotSize } = calculatePositionSize(buildCalculateInput(state));

  // TODO move this to guard this whole function
  if (isAnythingUnset(state)) {
    state.lotSize = 0;
    return state;
  }

  state.lotSize = lotSize;
  return state;
};

const isAnythingUnset = (state: State): boolean => {
  return (
    state.accountBalance === 0 ||
    state.baseCurrency === "" ||
    state.pair === "" ||
    state.riskPercentage === 0 ||
    state.stopLossPips === 0
  );
};

/* TODO
- cache this,
- require that base currency is set
*/
const fetchExchangeRates = (state: State) => {
  const symbols = BASE_CURRENCIES.join(",");
  const requestURL = `${EXCHANGE_RATE_URL}?base=${state.baseCurrency}&symbols=${symbols}`;
  const request = new XMLHttpRequest();
  request.open("GET", requestURL);
  request.responseType = "json";
  request.send();

  request.onload = function () {
    const response = request.response;
    const { success, rates } = response;
    if (success) {
      console.log("rates", rates, requestURL);
    } else {
      console.error("error fetching exchange rates", response);
    }
  };
};
