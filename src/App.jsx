import { useEffect, useState } from "react";
import Board from "./components/Board";

function App() {
  const [board, setBoard] = useState(Array(64).fill(0));
  const [moves, setMoves] = useState(Array(64).fill(0));
  const [nbrChromosomes, setNbrChromosomes] = useState(50);
  const [nbrGen, setNbrGen] = useState(50);
  const [parametre, setParametre] = useState(false);

  const generations = 10;

  const updateBoard = (index, newValue) => {
    setBoard((prevBoard) => {
      const newBoard = [...prevBoard];
      newBoard[index] = newValue;
      return newBoard;
    });
  };

  const handleClick = () => {
    setParametre(!parametre);
  };

  const handleNbrChromosomesChange = (event) => {
    setNbrChromosomes(event.target.value);
  };
  const handlNbrGenChange = (event) => {
    setNbrGen(event.target.value);
  };

  return (
    <>
      <div className="container">
        {!parametre && (
          <div className="param">
            <div className="selector">
              <span id="rangeValue">
                Chromosomes Number
                <br />
                {nbrChromosomes}
              </span>
              <input
                class="range"
                type="range"
                min="50"
                max="1000"
                value={nbrChromosomes}
                onChange={handleNbrChromosomesChange}
              />
            </div>
            <div className="selector">
              <span id="rangeValue">
                Generations Number
                <br />
                {nbrGen}
              </span>
              <input
                class="range"
                type="range"
                min="50"
                max="5000"
                value={nbrGen}
                onChange={handlNbrGenChange}
              />
            </div>
            <button className="Button" onClick={handleClick}>
              continue
            </button>
          </div>
        )}
        {parametre && (
          <Board
            board={board}
            updateBoard={updateBoard}
            moves={moves}
            setMoves={setMoves}
            setBoard={setBoard}
            nbrChromosomes={nbrChromosomes}
            nbrGen={nbrGen}
            handleClick={handleClick}
          />
        )}
      </div>
    </>
  );
}

export default App;
