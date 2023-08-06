import React, { useState, useId, SyntheticEvent } from "react";
import "./App.css";
import { PAIRS, BASE_CURRENCIES } from "./constants";
import { State, buildState } from "./State";

interface IApp {
  appState: State;
}

function App(app: IApp) {
  const [state, setState] = useState(app.appState);
  const baseCurrencySelectId = useId();
  const pairsSelectId = useId();

  const handleSelect = async (newValue: string, field: string) => {
    if (field === "pair") {
      state.pair = newValue;
    } else {
      state.baseCurrency = newValue;
    }

    const newState = await buildState(state);
    setState((prevState) => {
      return {
        ...prevState,
        ...newState,
      };
    });
  };

  const handleNumberInput = async (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const newValue = Number(parseFloat(event.target.value).toFixed(2));

    if (!isNaN(newValue)) {
      if (field === "accountBalance") {
        state.accountBalance = newValue;
      } else if (field === "stopLoss") {
        state.stopLossPips = newValue;
      } else {
        state.riskPercentage = newValue;
      }
    } else {
      if (field === "accountBalance") {
        state.accountBalance = 0;
      } else if (field === "stopLoss") {
        state.stopLossPips = 0;
      } else {
        state.riskPercentage = 0;
      }
    }

    const calculated = await buildState(state);
    setState((prevState) => {
      return {
        ...prevState,
        ...calculated,
      };
    });
  };

  const summarize = () => {
    const isCopyDisabled = state.isFetchError || state.lotSize === 0;
    return (
      <section>
        <span>
          {state.isFetchError
            ? "Error fetching data. Sorry"
            : `Standard lot size: ${state.lotSize}`}
        </span>
        <span
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <button
            disabled={isCopyDisabled}
            aria-disabled={isCopyDisabled}
            onClick={updateClipboard}
            style={{ width: "25%" }}
          >
            copy
          </button>
        </span>
      </section>
    );
  };

  const updateClipboard = (e: SyntheticEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(`${state.lotSize}`);
  };

  const baseCurrencies = () => {
    return (
      <>
        <label htmlFor={baseCurrencySelectId}>Base currency</label>
        <select
          id={baseCurrencySelectId}
          name="selectedBaseCurrency"
          value={state.baseCurrency}
          onChange={(e) => handleSelect(e.target.value, "baseCurrency")}
        >
          <option value="">Select a base currency</option>
          {BASE_CURRENCIES.map((currency) => {
            return (
              <option key={currency} value={currency}>
                {currency}
              </option>
            );
          })}
        </select>
      </>
    );
  };

  const pairs = () => {
    return (
      <>
        <label htmlFor={pairsSelectId}>Pair</label>
        <select
          id={pairsSelectId}
          name="selectedPair"
          value={state.pair}
          onChange={(e) => handleSelect(e.target.value, "pair")}
        >
          <option value="">Select a currency pair</option>
          {PAIRS.map((pair) => {
            return (
              <option key={pair} value={pair}>
                {pair}
              </option>
            );
          })}
        </select>
      </>
    );
  };

  return (
    <div className="App">
      <h1>Lot Size Calculator</h1>
      <section>{baseCurrencies()}</section>
      <section>{pairs()}</section>
      <section>
        <label>
          Account Value
          <input
            type="number"
            step="0.01"
            min="0"
            value={state.accountBalance}
            onInput={(e) =>
              handleNumberInput(
                e as React.ChangeEvent<HTMLInputElement>,
                "accountBalance"
              )
            }
          />
        </label>
      </section>
      <section>
        <label>
          Risk Percentage
          <input
            type="number"
            step="0.1"
            min="0"
            value={state.riskPercentage}
            onInput={(e) =>
              handleNumberInput(
                e as React.ChangeEvent<HTMLInputElement>,
                "riskPercentage"
              )
            }
          />
        </label>
      </section>
      <section>
        <label>
          Stop Loss (pips)
          <input
            type="number"
            step="0.01"
            min="0"
            value={state.stopLossPips}
            onInput={(e) =>
              handleNumberInput(
                e as React.ChangeEvent<HTMLInputElement>,
                "stopLoss"
              )
            }
          />
        </label>
      </section>
      <summary>{summarize()}</summary>
    </div>
  );
}

export default App;
