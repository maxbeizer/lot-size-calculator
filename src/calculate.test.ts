import calculatePositionSize, {
  CalculateInput,
  CalculateOutput,
} from "./calculate";

// table tests a la golang

// A type of the test case composed of the input and output interfaces and the
// name of the test
type TestCase = CalculateInput & CalculateOutput & { name: string };

// compose Input and Output interfaces from the calculate file
// and use them to type the test cases
const testCases: Array<TestCase> = [
  {
    name: "Base USD: EUR/CAD",
    accountBalance: 10000,
    riskPercentage: 1,
    stopLossPips: 10,
    baseCurrency: "USD",
    quoteCurrency: "CAD",
    askPrice: 1.4706,
    bidPrice: 1.471,
    positionSize: 147060,
    pipValue: 14.71,
    lotSize: 1.4706,
  },
  {
    name: "Base USD: GBP/AUD",
    accountBalance: 10000,
    riskPercentage: 1,
    stopLossPips: 10,
    baseCurrency: "USD",
    quoteCurrency: "AUD",
    askPrice: 0.6646,
    bidPrice: 0.6638,
    positionSize: 150647.7855,
    pipValue: 15.06,
    lotSize: 1.5065,
  },
  {
    name: "Base USD: GBP/JPY",
    accountBalance: 10000,
    riskPercentage: 1,
    stopLossPips: 10,
    baseCurrency: "USD",
    quoteCurrency: "JPY",
    askPrice: 134.17,
    bidPrice: 134.15,
    positionSize: 134170,
    pipValue: 1341.7,
    lotSize: 1.3417,
  },
  {
    name: "Base GBP: GBP/JPY",
    accountBalance: 10000,
    riskPercentage: 1,
    stopLossPips: 10,
    baseCurrency: "GBP",
    quoteCurrency: "JPY",
    askPrice: 168.92,
    bidPrice: 169.01,
    positionSize: 168920,
    pipValue: 1689.2,
    lotSize: 1.6892,
  },
  {
    name: "Base JPY: GBP/JPY",
    accountBalance: 10000,
    riskPercentage: 1,
    stopLossPips: 10,
    baseCurrency: "JPY",
    quoteCurrency: "JPY",
    askPrice: 168.92,
    bidPrice: 169.01,
    positionSize: 100000,
    pipValue: 10,
    lotSize: 1,
  },
//   {
//     name: "Base JPY: GBP/CHF",
//     accountBalance: 10000,
//     riskPercentage: 1,
//     stopLossPips: 10,
//     baseCurrency: "JPY",
//     quoteCurrency: "CHF",
//     askPrice: 1.1179,
//     bidPrice: 1.1186,
//     positionSize: 8939746.1112,
//     pipValue: 893.97,
//     lotSize: 89.3975,
//   },
];

testCases.forEach((tc) => {
  test(`${tc.name}`, () => {
    const { positionSize, pipValue, lotSize } = calculatePositionSize(tc);
    expect(positionSize).toBe(tc.positionSize);
    expect(pipValue).toBe(tc.pipValue);
    expect(lotSize).toBe(tc.lotSize);
  });
});
