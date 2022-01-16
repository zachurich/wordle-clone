import { useEffect, useState } from "react";
import "./app.css";

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
  "z",
  "x",
  "c",
  "v",
  "b",
  "n",
  "m",
];

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
    <div className="App">
      <header>
        <h1> 🔥 Wordle Clone 🔥</h1>
        <h2>Turn: {currentTurn}</h2>
      </header>
      <main>
        <section>
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
  return (
    <div>
      {Object.entries(guesses).map(([guessCount, guessValues]) => (
        <Guess guessValues={guessValues} />
      ))}
    </div>
  );
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
  return keys.map((key) => (
    <button onClick={() => onLetterClick(key)}>
      <strong>{key.toUpperCase()}</strong>
    </button>
  ));
}

export default App;
