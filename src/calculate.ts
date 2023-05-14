import { PAIRS } from "./constants";

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
  const lotSize = pipValue / 10;
  const positionSize = lotSize * positionSizeMultiplier(currencies);

  return {
    positionSize: toFixedNumber(positionSize, 4),
    pipValue: toFixedNumber(pipValue, 2),
    lotSize: toFixedNumber(lotSize / lotSizeMultiplier(currencies), 4),
  };
}

function pipValueMultiplier(
  { bidPrice, askPrice }: Prices,
  { quoteCurrency, baseCurrency }: Currencies
): number {
  if (quoteCurrency === baseCurrency) return 1;

  return PAIRS.includes(`${quoteCurrency}${baseCurrency}`)
    ? 1 / bidPrice
    : askPrice;
}

function positionSizeMultiplier({
  quoteCurrency,
  baseCurrency,
}: Currencies): number {
  if (quoteCurrency === baseCurrency) return 100000;

  return quoteCurrency === "JPY" ? 1000 : 100000;
}

function lotSizeMultiplier({
  quoteCurrency,
  baseCurrency,
}: Currencies): number {
  if (quoteCurrency === baseCurrency) return 1;

  return quoteCurrency === "JPY" ? 100 : 1;
}

function toFixedNumber(num: number, places: number): number {
  return +Number(num).toFixed(places);
}

export default calculatePositionSize;
