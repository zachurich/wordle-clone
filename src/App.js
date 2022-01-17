import { useCallback, useEffect, useState } from "react";
import classNames from "classnames";
import "./app.css";

const ENTER = "Enter";
const BACKSPACE = "Backspace";

const KEYS = [
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

const rowOne = KEYS.slice(0, KEYS.indexOf("p") + 1);
const rowTwo = KEYS.slice(KEYS.indexOf("p") + 1, KEYS.indexOf("l") + 1);
const rowThree = KEYS.slice(KEYS.indexOf("l") + 1, KEYS.length);

const keyRows = [rowOne, rowTwo, rowThree];

const initialGuesses = Array.from({ length: 6 }, (_, i) => i).map(() => [
  "",
  "",
  "",
  "",
  "",
]);

const guessCount = initialGuesses.length - 1;

const initialCurrentGuess = Array.from({ length: 5 }, (_, i) => i).map(
  () => ""
);

const wordList = ["raven", "quiet", "words"];

const correctWord = wordList[Math.floor(Math.random() * wordList.length)];

const getLetterStateClass = (guessValues, letter) => {
  let guessState;
  const rightPlaceCheck = !guessValues.length
    ? !!Object.values(guessValues)
        .map((guess) => guess.join(""))
        .find((guess) => correctWord.indexOf(letter) === guess.indexOf(letter))
    : correctWord.indexOf(letter) === guessValues.indexOf(letter);

  switch (true) {
    case correctWord.includes(letter) && rightPlaceCheck:
      guessState = "right-right-place";
      break;
    case correctWord.includes(letter):
      guessState = "right-wrong-place";
      break;
    default:
      guessState = "wrong";
      break;
  }
  return guessState;
};

const getGridLetterState = (
  guessValues,
  letter,
  currentTurn,
  rowTurn,
  won,
  lost
) => {
  if (
    (currentTurn !== rowTurn && letter) ||
    (currentTurn === rowTurn && (won || lost))
  ) {
    return getLetterStateClass(guessValues, letter);
  }

  return undefined;
};

const getKeyboardLetterState = (guessList, key) => {
  const allGuessedLetters = Object.values(guessList).join("");

  if (allGuessedLetters.includes(key)) {
    return getLetterStateClass(guessList, key);
  }

  return undefined;
};

function App() {
  const [currentTurn, setCurrentTurn] = useState(0);

  const [guessList, setGuessList] = useState(initialGuesses);

  const [currentGuess, setCurrentGuess] = useState(initialCurrentGuess);

  const [error, setError] = useState();

  const [won, setWon] = useState(false);

  const [lost, setLost] = useState(false);

  const submitGuess = useCallback(() => {
    const update = {
      ...guessList,
      [currentTurn]: Object.values(currentGuess),
    };

    if (Object.values(currentGuess).join("") === correctWord) {
      setGuessList(update);
      setWon(true);
    } else if (currentGuess[4] && currentTurn < guessCount) {
      setGuessList(update);
      setCurrentGuess(initialCurrentGuess);
      setCurrentTurn(currentTurn + 1);
    } else if (currentTurn >= guessCount) {
      setGuessList(update);
      setLost(true);
    } else {
      setError("Not enough letters");
    }
  }, [currentGuess, currentTurn, guessList]);

  const backspace = useCallback(() => {
    // Find the next available letter slot
    const currentLetterIndex = Object.keys(currentGuess).find(
      (key) => !currentGuess[key]
    );

    const update = {
      ...currentGuess,
      [currentLetterIndex && currentLetterIndex > 0
        ? currentLetterIndex - 1
        : 4]: "",
    };

    setCurrentGuess(update);
  }, [currentGuess]);

  const onKeyClick = useCallback(
    (keyValue) => {
      if (KEYS.includes(keyValue)) {
        if (keyValue === ENTER) return submitGuess();

        if (keyValue === BACKSPACE) return backspace();

        // Find the next available letter slot
        const currentLetterIndex = Object.keys(currentGuess).find(
          (key) => !currentGuess[key]
        );

        if (currentLetterIndex) {
          setCurrentGuess((currentGuess) => ({
            ...currentGuess,
            [currentLetterIndex]: keyValue,
          }));
        }
      }
    },
    [submitGuess, backspace, currentGuess]
  );

  useEffect(() => {
    const handleKeyPress = (e) => onKeyClick(e.key);

    document.addEventListener("keyup", handleKeyPress);

    return () => document.removeEventListener("keyup", handleKeyPress);
  }, [onKeyClick]);

  return (
    <div className="app">
      <header>
        <h1> 🔥 Wordle Clone 🔥</h1>
        <h2>Remaining: {guessCount - currentTurn}</h2>
      </header>
      {error ? (
        <Message text={error} clearError={() => setError(undefined)} isError />
      ) : null}
      {won ? <Message text={"You won!"} /> : null}
      {lost ? <Message text={"You lost."} isError /> : null}
      <main>
        <section className="guess-grid">
          <GuessGrid
            correctWord={correctWord}
            currentTurn={currentTurn}
            guesses={guessList}
            currentGuess={currentGuess}
            won={won}
            lost={lost}
          />
        </section>
        <section className="keyboard">
          <KeyBoard
            won={won}
            lost={lost}
            onKeyClick={onKeyClick}
            guessList={guessList}
          />
        </section>
      </main>
    </div>
  );
}

function GuessGrid({ currentTurn, currentGuess, guesses, won, lost }) {
  const guessRows = { ...guesses, [currentTurn]: Object.values(currentGuess) };
  return Object.entries(guessRows).map(([key, turnValues]) => (
    <Guess
      key={`${currentTurn}-${key}`}
      currentTurn={currentTurn}
      rowTurn={Number(key)}
      guessValues={turnValues}
      won={won}
      lost={lost}
    />
  ));
}

function Guess({ currentTurn, rowTurn, guessValues, won, lost }) {
  return (
    <div className="guess-row">
      {guessValues.map((letter, index) => {
        return (
          <span
            key={`${letter}-${index}`}
            className={classNames(
              "row-letter",
              getGridLetterState(
                guessValues,
                letter,
                currentTurn,
                rowTurn,
                won,
                lost
              ),
              {
                "row-letter__empty": !letter && currentTurn === rowTurn,
                "row-letter__won": won && currentTurn !== rowTurn,
              }
            )}
          >
            {letter}
          </span>
        );
      })}
    </div>
  );
}

function KeyBoard({ won, lost, onKeyClick, guessList }) {
  return keyRows.map((row, index) => (
    <div key={`row-${index}`} className="key-row">
      {row.map((key) => (
        <button
          disabled={won || lost}
          key={key}
          className={classNames("key", getKeyboardLetterState(guessList, key))}
          onClick={() => onKeyClick(key)}
        >
          {key}
        </button>
      ))}
    </div>
  ));
}

function Message({ text, clearError, isError }) {
  useEffect(() => {
    if (clearError) {
      setTimeout(() => clearError(), 1000);
    }
  }, [clearError]);
  return (
    <div className={`message message__${isError ? "error" : "success"}`}>
      {text}
    </div>
  );
}

export default App;
