import { PAIRS } from "./constants";
export interface CalculateInput {
  accountBalance: number;
  riskPercentage: number;
  stopLossPips: number;
  baseCurrency: string;
  quoteCurrency: string;
  bidPrice: number;
  askPrice: number;
}

export interface CalculateOutput {
  positionSize: number;
  pipValue: number;
  lotSize: number;
}

function calculatePositionSize(input: CalculateInput): CalculateOutput {
  const {
    accountBalance,
    riskPercentage,
    stopLossPips,
    baseCurrency,
    quoteCurrency,
    bidPrice,
    askPrice,
  } = input;

  const riskAmount = accountBalance * (riskPercentage / 100); // 100
  const pipValue =
    (riskAmount / stopLossPips) *
    pipValueDenominator(bidPrice, askPrice, quoteCurrency, baseCurrency);
  const lotSize = pipValue / 10;

  return {
    positionSize: +Number(lotSize * positionSizeMultiplier(quoteCurrency, baseCurrency)).toFixed(4),
    pipValue: +Number(pipValue).toFixed(2),
    lotSize: +Number(lotSize/lotSizeMultiplier(quoteCurrency)).toFixed(4),
  };
}

function pipValueDenominator(
  bidPrice: number,
  askPrice: number,
  quoteCurrency: string,
  baseCurrency: string
): number {
  if (quoteCurrency === baseCurrency) return 1;

  return PAIRS.includes(`${quoteCurrency}${baseCurrency}`) ? 1/bidPrice : askPrice;
}

function positionSizeMultiplier(
  quoteCurrency: string,
  baseCurrency: string
): number {
  if (quoteCurrency === baseCurrency) return 10000;

  return quoteCurrency === "JPY" ? 1000: 100000
}

function lotSizeMultiplier(
  quoteCurrency: string,
): number {
  return quoteCurrency === "JPY" ? 100: 1
}

export default calculatePositionSize;
