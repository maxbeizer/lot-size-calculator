# Lot Size Calculator

Created with [Create React App](https://create-react-app.dev/)

## Development

```
script/setup
script/test
script/dev # or npm run
```

## Understanding the algorithm

```
Pips at risk * pip value * lots traded = amount at risk
```

1. Account balance is $10,000 USD
1. Risk is 1%
1. Stop loss is 10 pips
1. Convert risk to local currency. If base currency is denmoninator, then bid price. If numerator, then ask price.
    1.  If account currency is denominator, then pip value is 1. So `risk in dollars/pips in dollars == position` . $100/ 10 pips * $1 => 10 mini lots (1 standard)
    1.  EUR/CAD. USD/CAD ask is 1/1.2219.
        1. $100 / 10 pips * 1.2219 = 1.2219 standard or 12.21 mini
    1.  GBP/AUD. AUD/USD bid is 1.4458 so
        1. 1AUD/1.4458USD => `1/1.4458=0.6913` => $1USD = $0.69AUD
        1. position size is therefore .6913 * 100k
        1. Standard lot is `.6913`. Mini lot is `6.913` etc
    1. EUR/JPY. USD/JPY ask 135.774
        1. $100 / 10 pips * 135.774 / 1000 (for yen) = 1.35 standard, 13.5 mini


Copilot version

```typescript
interface Input {
  accountBalance: number;
  riskPercentage: number;
  stopLossPips: number;
  baseCurrency: string;
  quoteCurrency: string;
  bidPrice: number;
  askPrice: number;
}

interface Output {
  positionSize: number;
  pipValue: number;
  lotSize: number;
}

function calculatePositionSize(input: Input): Output {
  const { accountBalance, riskPercentage, stopLossPips, baseCurrency, quoteCurrency, bidPrice, askPrice } = input;

  const riskAmount = accountBalance * (riskPercentage / 100);
  const pipValue = (riskAmount / stopLossPips) * (quoteCurrency === baseCurrency ? 1 : askPrice);
  const lotSize = pipValue / 10;

  return {
    positionSize: riskAmount / (stopLossPips * pipValue),
    pipValue,
    lotSize,
  };
}
```
    
