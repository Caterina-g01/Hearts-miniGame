import { useState, JSX, useEffect } from "react";
import "./App.css";

function App() {
  const [redHeartsCount, setRedHeartsCount] = useState<number>(0);
  const [whiteHeartsCount, setWhiteHeartsCount] = useState<number>(0);
  const [redHearts, setRedHearts] = useState<JSX.Element[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [whiteHearts, setWhiteHearts] = useState<JSX.Element[]>([]);
  const [inGame, setInGame] = useState<boolean>(false);
  const [showRules, setShowRules] = useState<boolean>(false);
  const [rulesTimeLeft, setRulesTimeLeft] = useState<number>(10);
  const [gameTimeLeft, setGameTimeLeft] = useState<number>(15);

  function handleAddRedHeart() {
    const heart = <div className="heart" key={Date.now()}></div>;
    if (redHeartsCount >= 100) return null;
    setRedHeartsCount(redHeartsCount + 1);
    setRedHearts((prevHearts) => [...prevHearts, heart]);
  }

  useEffect(() => {
    if (inGame) {
      const redHeartsInGame = [];
      for (let i = 0; i < 100; i++) {
        redHeartsInGame.push(<div className="heart" key={i}></div>);
      }
      setRedHearts(redHeartsInGame);
      setRedHeartsCount(100);
    }
  }, [inGame]);

  function handleGameStart() {
    setShowRules(true);

    const rulesPromise = new Promise<void>((resolve) => {
      const rulesTimer = setInterval(() => {
        setRulesTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(rulesTimer);
            setShowRules(false);
            resolve();
            setWhiteHearts([]);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    });

    rulesPromise.then(() => {
      setWhiteHearts([]);
      setInGame(true);
      const gameTimer = setInterval(() => {
        setGameTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(gameTimer);
            setInGame(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      setGameTimeLeft(15);
    });

    setRulesTimeLeft(10);
    setInGame(false);
  }

  function renderRules() {
    if (showRules) {
      return (
        <p>
          Move all 100 <span className="red">red</span> hearts to{" "}
          <span className="white">white</span> hearts within 15 seconds by
          clicking the + button. Test your speed and accuracy!
        </p>
      );
    } else if (inGame) {
      return <p>START!</p>;
    } else {
      return null;
    }
  }

  function handleReduceRedHeart() {
    if (redHeartsCount <= 0) return;
    setRedHeartsCount(redHeartsCount - 1);
    setRedHearts((prevHearts) => prevHearts.slice(0, -1));
  }

  function handleAddWhiteHeart() {
    if (whiteHeartsCount >= 100) return null;
    const heart = <div className="white-heart" key={Date.now()}></div>;
    if (redHearts.length > 0 || inGame) {
      setWhiteHearts((prevHearts) => [...prevHearts, heart]);
      setWhiteHeartsCount(whiteHeartsCount + 1);
      handleReduceRedHeart();
    }
  }

  function handleReduceWhiteHeart() {
    if (whiteHeartsCount > 0) {
      setWhiteHeartsCount(whiteHeartsCount - 1);
      setWhiteHearts((prevHearts) => prevHearts.slice(0, -1));
      handleAddRedHeart();
    }
  }

  function handleEditing() {
    setEditMode(true);
  }

  function handleAddInputNumberHearts(value: number) {
    const hearts = [];
    for (let i = 0; i < value; i++) {
      hearts.push(<div className="heart" key={i}></div>);
    }
    setRedHearts(hearts);
    setEditMode(false);
  }

  function renderStateOfCount() {
    if (editMode) {
      return (
        <input
          value={redHeartsCount}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddInputNumberHearts(redHeartsCount);
            }
          }}
          onBlur={() => handleAddInputNumberHearts(redHeartsCount)}
          onChange={(e) => handleChangeInput(Number(e.target.value))}
          type="text"
        />
      );
    } else {
      return <div onClick={() => handleEditing()}>{redHeartsCount}</div>;
    }
  }

  function handleChangeInput(value: number) {
    if (isNaN(value) || value < 0 || value > 100) {
      setRedHeartsCount(0);
    } else {
      setRedHeartsCount(value);
    }
  }

  function renderGameButton() {
    if (showRules) {
      return <button onClick={() => handleGameStart()}>{rulesTimeLeft}</button>;
    } else if (inGame) {
      return <button onClick={() => handleGameStart()}>{gameTimeLeft}</button>;
    } else {
      return <button onClick={() => handleGameStart()}>Start the game</button>;
    }
  }

  return (
    <>
      <div className="container">
        <div className="main">
          <p>
            You can move hearts around just for fun, or play the game and
            complete the challenge!
          </p>
          {renderGameButton()}
          {renderRules()}
          <div className="all-hearts-container">
            <div className="hearts-column-container">
              <div className="btns-hearts-container">
                {renderStateOfCount()}
                <div className="btns-container">
                  <button
                    className={`${inGame || showRules ? "disabled" : ""}`}
                    onClick={(e) => {
                      if (inGame || showRules) {
                        e.preventDefault();
                      } else {
                        handleAddRedHeart();
                      }
                    }}
                  >
                    +
                  </button>
                  <button
                    className={`${
                      redHeartsCount === 0 || inGame ? "disabled" : ""
                    }`}
                    onClick={(e) => {
                      if (inGame) {
                        e.preventDefault();
                      } else {
                        handleReduceRedHeart();
                      }
                    }}
                  >
                    -
                  </button>
                </div>
                <p>Max 100 hearts</p>
              </div>
              {inGame ? (
                <div className="hearts-container">{redHearts}</div>
              ) : (
                <div className="hearts-container">{redHearts}</div>
              )}
            </div>
            <div className="hearts-column-container">
              <div className="btns-hearts-container">
                <div>{whiteHeartsCount}</div>
                <div className="btns-container">
                  <button
                    className={`${
                      redHeartsCount === 0 ||
                      showRules ||
                      !inGame ||
                      gameTimeLeft === 0
                        ? "disabled"
                        : ""
                    } ${inGame ? "active" : ""}`}
                    onClick={(e) => {
                      if (showRules || !inGame || gameTimeLeft === 0) {
                        e.preventDefault();
                      } else {
                        handleAddWhiteHeart();
                      }
                    }}
                  >
                    +
                  </button>
                  <button
                    className={`${whiteHeartsCount === 0 ? "disabled" : ""}`}
                    onClick={(e) => {
                      if (inGame) {
                        e.preventDefault();
                      } else {
                        handleReduceWhiteHeart();
                      }
                    }}
                  >
                    -
                  </button>
                </div>
                <p>Max 100 hearts</p>
              </div>
              <div className="hearts-container">{whiteHearts}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
// quando scade disable btn
