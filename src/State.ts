import { BASE_CURRENCIES, EXCHANGE_RATE_URL } from "./constants";
import calculatePositionSize, { buildCalculateInput } from "./calculate";

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
  isFetchError: boolean;

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
    isFetchError = false,
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
    this.isFetchError = isFetchError;
  }
}

/*
 */
export const buildState = async (state: State): Promise<State> => {
  if (isAnythingUnset(state)) {
    state.lotSize = 0;
    return state;
  }

  state = await fetchExchangeRates(state);

  if (state.isFetchError) {
    state.lotSize = 0;
    return state;
  }

  const { lotSize } = calculatePositionSize(buildCalculateInput(state));
  state.lotSize = lotSize;
  return state;
};

// Do not do any work if we don't have all the required data
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
const fetchExchangeRates = async (state: State): Promise<State> => {
  const symbols = BASE_CURRENCIES.join(",");
  const requestURL = `${EXCHANGE_RATE_URL}?base=${state.baseCurrency}&symbols=${symbols}`;
  const res = await fetch(requestURL);
  const { rates, success } = await res.json();

  if (!success) {
    state.isFetchError = true;
    return state;
  }

  const { bottom } = splitPair(state.pair);
  state.quoteCurrency = bottom;
  state.bidPrice = rates[state.quoteCurrency] || 0;
  state.askPrice = rates[state.quoteCurrency] || 0;
  return state;
};

/*
 * Turns GBPJPY into { top: 'GBP', bottom: 'JPY' }
 */
const splitPair = (pair: string) => {
  return {
    top: pair.substring(0, 3),
    bottom: pair.substring(3),
  };
};
