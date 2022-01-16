import { useEffect, useState } from "react";
import "./app.css";

const ENTER = "enter";
const BACKSPACE = "[x]";

const keys = [
  "q",
  "w",
  "e",
  "r",
  "t",
  "y",
  "u",
  "i",
  "o",
  "p",
  "a",
  "s",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  ENTER,
  "z",
  "x",
  "c",
  "v",
  "b",
  "n",
  "m",
  BACKSPACE,
];

const rowOne = keys.slice(0, keys.indexOf("p") + 1);
const rowTwo = keys.slice(keys.indexOf("p") + 1, keys.indexOf("l") + 1);
const rowThree = keys.slice(keys.indexOf("l") + 1, keys.length);
const keyRows = [rowOne, rowTwo, rowThree];

const guessCount = 6;

const initialCurrentGuess = {
  1: "",
  2: "",
  3: "",
  4: "",
  5: "",
};

const emptyGuess = ["", "", "", "", ""];

const initialGuesses = {
  1: emptyGuess,
  2: emptyGuess,
  3: emptyGuess,
  4: emptyGuess,
  5: emptyGuess,
  6: emptyGuess,
};

function App() {
  const [currentTurn, setCurrentTurn] = useState(1);

  const [guesses, setGuesses] = useState(initialGuesses);

  const [currentGuess, setCurrentGuess] = useState(initialCurrentGuess);

  useEffect(() => {
    // If we have set letter 5 in the current guess, add it to the previous and prep next guess
    if (currentGuess[5] && currentTurn <= guessCount) {
      const update = { ...guesses, [currentTurn]: currentGuess };
      setGuesses(update);
      setCurrentGuess(initialCurrentGuess);
      setCurrentTurn(currentTurn + 1);
    }
  }, [currentGuess, currentTurn, guesses]);

  const onLetterClick = (letter) => {
    console.log(letter);
  };

  return (
    <div className="app">
      <header>
        <h1> 🔥 Wordle Clone 🔥</h1>
        <h2>Turn: {currentTurn}</h2>
      </header>
      <main>
        <section className="guess-grid">
          <GuessGrid guesses={guesses} currentGuess={currentGuess} />
        </section>
        <section className="keyboard">
          <KeyBoard onLetterClick={onLetterClick} />
        </section>
      </main>
    </div>
  );
}

function GuessGrid({ currentGuess, guesses }) {
  return Object.entries(guesses).map(([guessCount, guessValues]) => (
    <Guess guessValues={guessValues} />
  ));
}

function Guess({ guessValues }) {
  return (
    <div className="guess-row">
      {guessValues.map((letter) => (
        <span className="guess-row__letter">{letter}</span>
      ))}
    </div>
  );
}

function KeyBoard({ onLetterClick }) {
  return keyRows.map((row) => (
    <div className="key-row">
      {row.map((key) => {
        return (
          <button className="key" onClick={() => onLetterClick(key)}>
            <strong>{key.toUpperCase()}</strong>
          </button>
        );
      })}
    </div>
  ));
}

export default App;
