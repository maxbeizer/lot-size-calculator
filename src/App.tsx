import React, { useState } from "react";
import "./App.css";
import { PAIRS, BASE_CURRENCIES } from "./constants";
import { State, buildState } from "./State";

interface IApp {
  appState: State;
}

interface ITypeaheadProps {
  items: Array<string>;
  onSelect: (value: string) => void;
}
interface ITypeaheadState {
  suggestions: Array<string>;
  text: string;
}

class TypeAheadDropDown extends React.Component {
  state: ITypeaheadState;
  props: ITypeaheadProps;

  constructor(props: ITypeaheadProps) {
    super(props);
    this.props = props;
    this.state = {
      suggestions: [],
      text: "",
    } as ITypeaheadState;
  }

  onTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { items } = this.props;
    let suggestions: Array<String> = [];
    const value = event.target.value;
    if (value.length > 0) {
      const regex = new RegExp(`^${value}`, `i`);
      suggestions = items.sort().filter((v) => regex.test(v));
    }

    this.setState(() => ({
      suggestions,
      text: value,
    }));
  };

  suggestionSelected = (value: string) => {
    this.setState(() => ({
      text: value,
      suggestions: [],
    }));
    this.props.onSelect(value);
  };

  renderSuggestions = () => {
    const { suggestions } = this.state;
    if (suggestions.length === 0) {
      return null;
    }
    return (
      <ul>
        {suggestions.map((pair) => (
          <li key={pair} onClick={() => this.suggestionSelected(pair)}>
            {pair}
          </li>
        ))}
      </ul>
    );
  };

  render() {
    const { text } = this.state;
    return (
      <span className="TypeAheadDropDown">
        <input
          onChange={this.onTextChange}
          placeholder="Search by symbol"
          value={text}
          type="text"
        />
        {this.renderSuggestions()}
      </span>
    );
  }
}

function App(app: IApp) {
  const [state, setState] = useState(app.appState);

  const handleSelect = (newValue: string, field: string) => {
    if (field === "pair") {
      state.pair = newValue;
    } else {
      state.baseCurrency = newValue;
    }

    const newState = buildState(state);
    setState((prevState) => {
      return {
        ...prevState,
        state: newState,
      };
    });
  };

  const handleNumberInput = (
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

    const calculated = buildState(state);
    setState((prevState) => {
      return {
        ...prevState,
        state: calculated,
      };
    });
  };

  return (
    <div className="App">
      <h1>Lot Size Calculator</h1>
      <section>
        <label>Base Currency</label>
        <TypeAheadDropDown
          items={BASE_CURRENCIES}
          onSelect={(e) => handleSelect(e, "baseCurrency")}
        />
      </section>
      <section>
        <label>Pair</label>
        <TypeAheadDropDown
          items={PAIRS}
          onSelect={(e) => handleSelect(e, "pair")}
        />
      </section>
      <section>
        <label>Account Value</label>
        <input
          type="number"
          step="0.1"
          min="0"
          value={state.accountBalance}
          onInput={(e) =>
            handleNumberInput(
              e as React.ChangeEvent<HTMLInputElement>,
              "accountBalance"
            )
          }
        />
      </section>
      <section>
        <label>Risk Percentage</label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={state.riskPercentage}
          onInput={(e) =>
            handleNumberInput(
              e as React.ChangeEvent<HTMLInputElement>,
              "riskPercentage"
            )
          }
        />
      </section>
      <section>
        <label>Stop Loss (pips)</label>
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
      </section>
      <section>Lot size: {state.lotSize}</section>
    </div>
  );
}

export default App;
