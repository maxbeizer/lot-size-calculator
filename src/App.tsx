import React, { useState } from "react";
import "./App.css";
import PAIRS from "./pairs";

export class State {
  accountBalance: number;
  lotSize: number;
  pair: string;

  constructor() {
    this.accountBalance = 0;
    this.lotSize = 0;
    this.pair = "";
  }
}

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
          placeholder="Search pairs name"
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

  const handleSelect = (newValue: string) => {
    state.pair = newValue;
    setState((prevState) => {
      return {
        ...prevState,
        state: state,
      };
    });
    console.log(state);
  };

  const handleNumberInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value, 10);
    if (!isNaN(newValue)) {
      state.accountBalance = newValue;
      setState((prevState) => {
        return {
          ...prevState,
          state: state,
        };
      });
    } else {
      state.accountBalance = 0;
      setState((prevState) => {
        return {
          ...prevState,
          state: state,
        };
      });
    }
  };

  return (
    <div className="App">
      <section>
        <label>Pair: </label>
        <TypeAheadDropDown items={PAIRS} onSelect={handleSelect} />
      </section>
      <section>
        <label>Account Value: </label>
        <input
          type="number"
          value={state.accountBalance}
          onInput={handleNumberInput}
        />
      </section>
      <section>Lot size: {state.lotSize}</section>
    </div>
  );
}

export default App;
