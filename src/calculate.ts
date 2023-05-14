import { PAIRS } from "./constants";

type Currencies = {
  baseCurrency: string;
  quoteCurrency: string;
}

export type CalculateInput = {
  accountBalance: number;
  riskPercentage: number;
  stopLossPips: number;
  bidPrice: number;
  askPrice: number;
} & Currencies;

export type CalculateOutput = {
  positionSize: number;
  pipValue: number;
  lotSize: number;
}

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
  const riskAmount = accountBalance * (riskPercentage / 100);
  const pipValue =
    (riskAmount / stopLossPips) *
    pipValueMultiplier(bidPrice, askPrice, currencies);
  const lotSize = pipValue / 10;

  return {
    positionSize: +Number(
      lotSize * positionSizeMultiplier(currencies)
    ).toFixed(4),
    pipValue: +Number(pipValue).toFixed(2),
    lotSize: +Number(
      lotSize / lotSizeMultiplier(currencies)
    ).toFixed(4),
  };
}

function pipValueMultiplier(
  bidPrice: number,
  askPrice: number,
  { quoteCurrency, baseCurrency }: Currencies
): number {
  if (quoteCurrency === baseCurrency) return 1;

  return PAIRS.includes(`${quoteCurrency}${baseCurrency}`)
    ? 1 / bidPrice
    : askPrice;
}

function positionSizeMultiplier(
  {quoteCurrency, baseCurrency}: Currencies
): number {
  if (quoteCurrency === baseCurrency) return 100000;

  return quoteCurrency === "JPY" ? 1000 : 100000;
}

function lotSizeMultiplier(
  {quoteCurrency, baseCurrency}: Currencies
): number {
  if (quoteCurrency === baseCurrency) return 1;

  return quoteCurrency === "JPY" ? 100 : 1;
}

export default calculatePositionSize;
