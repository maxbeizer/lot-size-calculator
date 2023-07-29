const PAIRS = [
  "AUDCAD",
  "AUDCHF",
  "AUDJPY",
  "AUDNZD",
  "AUDUSD",
  "CADCHF",
  "CADJPY",
  "CHFJPY",
  "EURAUD",
  "EURCAD",
  "EURCHF",
  "EURGBP",
  "EURJPY",
  "EURNZD",
  "EURUSD",
  "GBPAUD",
  "GBPCAD",
  "GBPCHF",
  "GBPJPY",
  "GBPNZD",
  "GBPUSD",
  "NDZUSD",
  "NZDCAD",
  "NZDCHF",
  "NZDJPY",
  "NZDUSD",
  "USDCAD",
  "USDCHF",
  "USDJPY",
];

const BASE_CURRENCIES = [
  "AUD",
  "CAD",
  "CHF",
  "EUR",
  "GBP",
  "JPY",
  "NZD",
  "USD",
];

const POSITION_SIZE_MULTIPLIER = 100_000;
const EXCHANGE_RATE_URL = "https://api.exchangerate.host/latest";

export { PAIRS, BASE_CURRENCIES, POSITION_SIZE_MULTIPLIER, EXCHANGE_RATE_URL };
