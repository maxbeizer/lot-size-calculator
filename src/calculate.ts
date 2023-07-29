import { PAIRS, POSITION_SIZE_MULTIPLIER } from "./constants";
import { State } from "./State";

type Currencies = {
  baseCurrency: string;
  quoteCurrency: string;
};

type Prices = {
  bidPrice: number;
  askPrice: number;
};

export type CalculateInput = {
  accountBalance: number;
  riskPercentage: number;
  stopLossPips: number;
} & Currencies &
  Prices;

export type CalculateOutput = {
  positionSize: number;
  pipValue: number;
  lotSize: number;
};

function calculatePositionSize({
  accountBalance,
  riskPercentage,
  stopLossPips,
  baseCurrency,
  quoteCurrency,
  bidPrice,
  askPrice,
}: CalculateInput): CalculateOutput {
  const currencies: Currencies = { baseCurrency, quoteCurrency };
  const prices: Prices = { bidPrice, askPrice };
  const riskAmount = accountBalance * (riskPercentage / 100);
  const riskPerPip = riskAmount / stopLossPips;
  const pipValue = riskPerPip * pipValueMultiplier(prices, currencies);
  const lotSize = pipValue * lotSizeMultiplier(currencies);
  const positionSize = lotSize * POSITION_SIZE_MULTIPLIER;

  return {
    positionSize: toFixedNumber(positionSize, 4),
    pipValue: toFixedNumber(pipValue, 2),
    lotSize: toFixedNumber(lotSize, 4),
  };
}

// Convert between the State type and the CalculateInput type
export function buildCalculateInput(state: State): CalculateInput {
  const {
    accountBalance,
    baseCurrency,
    quoteCurrency,
    riskPercentage,
    stopLossPips,
    bidPrice,
    askPrice,
  } = state;

  return {
    accountBalance,
    baseCurrency,
    quoteCurrency,
    riskPercentage,
    stopLossPips,
    bidPrice,
    askPrice,
  };
}

function pipValueMultiplier(
  { bidPrice, askPrice }: Prices,
  { quoteCurrency, baseCurrency }: Currencies
): number {
  if (quoteCurrency === baseCurrency) return 1;

  return PAIRS.includes(`${quoteCurrency}${baseCurrency}`)
    ? (1 / bidPrice) * yenMultiplier(baseCurrency)
    : askPrice;
}

function yenMultiplier(baseCurrency: string): number {
  return baseCurrency === "JPY" ? 100 : 1;
}

function lotSizeMultiplier({
  quoteCurrency,
  baseCurrency,
}: Currencies): number {
  if (quoteCurrency === baseCurrency) return 0.1;
  if (baseCurrency === "JPY") return 0.1;

  return quoteCurrency === "JPY" ? 0.001 : 0.1;
}

function toFixedNumber(num: number, places: number): number {
  return +Number(num).toFixed(places);
}

export default calculatePositionSize;
