import { BASE_CURRENCIES, EXCHANGE_RATE_URL } from "./constants";
import calculatePositionSize, { buildCalculateInput } from "./calculate";

const STANDARD_CACHE_TTL = 60; // 60 seconds
type Rates = {
  [key: string]: number;
};

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

/*
Fetch the exchange rates for the base currency and store them in local storage
if they are not already there and are not expired.
*/
const fetchExchangeRates = async (state: State): Promise<State> => {
  if (!state.baseCurrency || state.baseCurrency === "") {
    return state;
  }

  const symbols = BASE_CURRENCIES.join(",");
  const requestURL = `${EXCHANGE_RATE_URL}?base=${state.baseCurrency}&symbols=${symbols}`;
  const cacheResult = getExchangeRatesFromCache(state.baseCurrency);

  let rates = {} as Rates;
  let success = true;

  if (cacheResult) {
    rates = cacheResult;
  } else {
    const res = await fetch(requestURL);
    const resJSON = await res.json();
    rates = resJSON.rates;
    success = resJSON.success;
    cacheExchangeRates(state.baseCurrency, rates, STANDARD_CACHE_TTL);
  }

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
Store the exchange rates in local storage, using the base currency as the key and the rates as the value

- ttl is in seconds
*/
const cacheExchangeRates = (keyName: string, keyValue: Rates, ttl: number) => {
  const data = {
    value: keyValue,
    expiry: Date.now() + ttl * 1000,
  };

  localStorage.setItem(keyName, JSON.stringify(data));
};

/*
Get the exchange rates from local storage, if they exist and are not expired
*/
const getExchangeRatesFromCache = (keyName: string) => {
  const data = localStorage.getItem(keyName);
  if (!data) {
    return null;
  }

  const { value, expiry } = JSON.parse(data);
  if (Date.now() > expiry) {
    return null;
  }

  return value;
};

/*
Turns GBPJPY into { top: 'GBP', bottom: 'JPY' }
 */
const splitPair = (pair: string) => {
  return {
    top: pair.substring(0, 3),
    bottom: pair.substring(3),
  };
};
