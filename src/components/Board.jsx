import React, { useEffect, useState } from "react";
import Cell from "./Cell";
import { RiRestartLine } from "react-icons/ri";

import loader from "../assets/load.gif";
import { LuLoader2 } from "react-icons/lu";

const Board = ({
  board,
  updateBoard,
  moves,
  setMoves,
  setBoard,
  nbrChromosomes,
  nbrGen,
  handleClick,
}) => {
  const calculateMoves = (index) => {};

  const updateMoves = (index) => {
    setMoves((prevBoard) => {
      const newBoard = [...prevBoard];
      newBoard[index] = 1;
      return newBoard;
    });
  };
  const [bestPlace, setBestPlace] = useState({ board: [], conflic: 0 });
  const population = [{}];

  const calculateConflicts = (array) => {
    setMoves(Array(64).fill(0));

    let conflicts = 0;

    for (let i = 0; i < 64; i++) {
      const row = Math.floor(i / 8);
      const col = i % 8;
      if (array[i] === 1 || array[i] === 4) {
        // quenn and rock
        // Check horizontally
        // for (let c = 0; c < 8; c++) {
        //   if (c !== col && array[row * 8 + c] !== 0) {
        //     conflicts++;

        //     updateMoves(row * 8 + c);
        //     break;
        //   }
        // }

        for (let c = col - 1; c >= 0; c--) {
          if (array[row * 8 + c] !== 0) {
            conflicts++;
            updateMoves(row * 8 + c);
            break;
          }
        }
        // Check horizontally (right)
        for (let c = col + 1; c < 8; c++) {
          if (array[row * 8 + c] !== 0) {
            conflicts++;
            updateMoves(row * 8 + c);
            break;
          }
        }
      }
      if (array[i] === 1 || array[i] === 4) {
        /* quenn and rock*/ // Check vertically
        // for (let r = 0; r < 8; r++) {
        //   if (r !== row && array[r * 8 + col] !== 0) {
        //     conflicts++;
        //     updateMoves(r * 8 + col);
        //     break;
        //   }
        // }
        // Check vertically (up)
        for (let r = row - 1; r >= 0; r--) {
          if (array[r * 8 + col] !== 0) {
            conflicts++;
            updateMoves(r * 8 + col);
            break;
          }
        }
        // Check vertically (down)
        for (let r = row + 1; r < 8; r++) {
          if (array[r * 8 + col] !== 0) {
            conflicts++;
            updateMoves(r * 8 + col);
            break;
          }
        }
      }
      if (array[i] === 1 || array[i] === 2) {
        /*quenn and bishop*/ // Check diagonally
        // for (let r = 0; r < 8; r++) {
        //   for (let c = 0; c < 8; c++) {
        //     if (
        //       Math.abs(row - r) === Math.abs(col - c) &&
        //       r !== row &&
        //       c !== col &&
        //       array[r * 8 + c] !== 0
        //     ) {
        //       conflicts++;

        //       updateMoves(r * 8 + c);
        //       break;
        //     }
        //   }
        // }

        // Diagonal checks (left up)
        for (let r = row - 1, c = col - 1; r >= 0 && c >= 0; r--, c--) {
          if (array[r * 8 + c] !== 0) {
            conflicts++;
            updateMoves(r * 8 + c);
            break;
          }
        }
        // Diagonal checks (right up)
        for (let r = row - 1, c = col + 1; r >= 0 && c < 8; r--, c++) {
          if (array[r * 8 + c] !== 0) {
            conflicts++;
            updateMoves(r * 8 + c);
            break;
          }
        }
        // Diagonal checks (left down)
        for (let r = row + 1, c = col - 1; r < 8 && c >= 0; r++, c--) {
          if (array[r * 8 + c] !== 0) {
            conflicts++;
            updateMoves(r * 8 + c);
            break;
          }
        }
        // Diagonal checks (right down)
        for (let r = row + 1, c = col + 1; r < 8 && c < 8; r++, c++) {
          if (array[r * 8 + c] !== 0) {
            conflicts++;
            updateMoves(r * 8 + c);
            break;
          }
        }
      }
      if (array[i] === 3) {
        //knight
        const knightMoves = [
          [-2, -1],
          [-1, -2],
          [-2, 1],
          [-1, 2],
          [1, -2],
          [2, -1],
          [1, 2],
          [2, 1],
        ];

        for (let k = 0; k < knightMoves.length; k++) {
          const newRow = row + knightMoves[k][0];
          const newCol = col + knightMoves[k][1];
          if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            const newIndex = newRow * 8 + newCol;
            if (array[newIndex] !== 0 && array[newIndex] !== 0) {
              conflicts++;
              updateMoves(newIndex);
            }
          }
        }
      }
    }

    // Total conflicts
    return conflicts;
  };

  function calculateConf() {
    const totalConflicts = calculateConflicts(board);
    setText(`Conflicts : ${totalConflicts}`);
    console.log("Total Conflicts:", totalConflicts);
  }
  const randomNum = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const generateChromosome = async () => {
    let bestMatch = {
      bord: Array(64).fill(0),
      fitness: 0,
      proba: 0,
      starting: 0,
      ending: 0,
    };
    setDisabledReset(true);
    setInfo("Waiting For Result");
    var Chromosomes = [];
    let totalFitness = 0;
    for (let co = 0; co < nbrChromosomes; co++) {
      const array = Array(64).fill(0);
      const pieces = [1, 1, 2, 3, 4, 1, 1, 2, 3, 4];
      pieces.forEach((piece, index) => {
        let min = 0,
          max = 32;
        if (index > 4) {
          min = 32;
          max = 64;
        }
        let i = 0;
        do {
          i = randomNum(min, max);
        } while (array[i] !== 0);
        array[i] = piece;
      });

      // Update the state with a delay
      await new Promise((resolve) => {
        setTimeout(() => {
          setBoard(array);
          resolve();
        }, 100);
      });
      const conflictsNbr = calculateConflicts(array);
      const fite = 1 / (1 + conflictsNbr);
      const chromo = {
        bord: array,
        fitness: fite,
        proba: 0,
        starting: 0,
        ending: 0,
      };
      totalFitness += fite;
      if (bestMatch.fitness < chromo.fitness) {
        bestMatch = chromo;
      }
      Chromosomes.push(chromo);
    }

    //fitenss
    Chromosomes.sort((a, b) => b.fitness - a.fitness);
    Chromosomes.forEach((chromosome) => {
      chromosome.proba = chromosome.fitness / totalFitness;
    });

    for (let gen = 0; gen < nbrGen; gen++) {
      console.log("Generation ", gen + 1);

      //starting ending
      let cumulativeProbability = 0;
      Chromosomes.forEach((chromosome) => {
        chromosome.starting = cumulativeProbability * 100;
        cumulativeProbability += chromosome.proba;
        chromosome.ending = cumulativeProbability * 100;
      });

      console.log("Chromosomes", Chromosomes);

      console.log("bestMatch : ", bestMatch);
      const groups = selectPopulation(Chromosomes);
      console.log("selected Chromosome : ", groups);
      const afterCrossOver = crossOverResult(groups);
      console.log("Chross Over : ", afterCrossOver);
      Chromosomes = afterCrossOver;
      if (bestMatch.fitness < Chromosomes[0].fitness) {
        bestMatch = Chromosomes[0];
      }
    }
    setText(" ");
    setDisabledReset(false);
    setInfo(" ");
    console.log("bestMatch : ", bestMatch);
    setBoard(bestMatch.bord);
  };

  const selectPopulation = (Chromosomes) => {
    const selectionGroup = [];
    for (let i = 0; i < nbrChromosomes; i++) {
      const num = randomNum(0, 101); // Assuming randomNum generates a random number between 0 and 100 (inclusive)
      let selectedChromosome = {};
      for (const chromo of Chromosomes) {
        if (chromo.starting < num && chromo.ending >= num) {
          selectedChromosome = chromo;
          break;
        } else {
          selectedChromosome = Chromosomes[0];
          break;
        }
      }
      if (selectedChromosome !== null) {
        selectionGroup.push(selectedChromosome);
      }
    }
    console.log("selectionGroup", selectionGroup);
    return selectionGroup;
  };

  const emutation = (array) => {
    if (randomNum(0, 100) > 90) {
      /*----------------Version 1--------------------*/
      // var randomNUMBER;
      // do {
      //   randomNUMBER = randomNum(0, 63);
      // } while (array[randomNUMBER] === 0);
      // array[randomNUMBER] = randomNum(1, 5);
      /*---------------------------------------------*/

      /*----------------Version 2--------------------*/
      // var x;
      // do {
      //   x = randomNum(0, 32);
      // } while (array[x] === 0);
      // var y;
      // do {
      //   y = randomNum(32, 63);
      // } while (array[y] === 0);
      // var newCell = array[x];
      // array[x] = array[y];
      // array[y] = newCell;
      /*---------------------------------------------*/

      /*----------------Version 3--------------------*/
      // var x;
      // do {
      //   x = randomNum(0, 64);
      // } while (array[x] !== 0);
      // array[x] = randomNum(1, 5);
      /*---------------------------------------------*/

      /*----------------Version 4--------------------*/
      if (randomNum(0, 63) < 32) {
        var x;
        do {
          x = randomNum(0, 31);
        } while (array[x] !== 0);
        var y;
        do {
          y = randomNum(0, 31);
        } while (array[y] === 0);

        array[x] = array[y];
        array[y] = 0;
      } else {
        var x;
        do {
          x = randomNum(32, 63);
        } while (array[x] !== 0);
        var y;
        do {
          y = randomNum(32, 63);
        } while (array[y] === 0);
        array[x] = array[y];
        array[y] = 0;
      }
      /*---------------------------------------------*/
      console.log("Emutation result : ", array);
      return array;
    }
    return array;
  };

  const crossOver = (chrmo1, chrmo2) => {
    if (randomNum(0, 100) < 80) {
      const array1 = Array(64).fill(0);
      const array2 = Array(64).fill(0);
      // const crossPoint = 32;

      for (let i = 0; i < 64; i++) {
        if (i < 32) {
          array1[i] = chrmo1.bord[i];
          array2[i] = chrmo2.bord[i];
        } else {
          array2[i] = chrmo1.bord[i];
          array1[i] = chrmo2.bord[i];
        }
      }
      const arrayToSave1 = emutation(array1);
      // const arrayToSave1 = array1;

      const generated1 = {
        bord: arrayToSave1,
        fitness: 1 / (1 + calculateConflicts(arrayToSave1)),
        proba: 0,
        starting: 0,
        ending: 0,
      };

      const arrayToSave2 = emutation(array2);
      // const arrayToSave2 = array2;
      const generated2 = {
        bord: arrayToSave2,
        fitness: 1 / (1 + calculateConflicts(arrayToSave2)),
        proba: 0,
        starting: 0,
        ending: 0,
      };

      return [generated1, generated2];
    } else {
      return [chrmo1, chrmo2];
    }
  };

  const crossOverResult = (groups) => {
    const crossOverr = [];
    for (let i = 0; i < nbrChromosomes - 1; i += 2) {
      const chromo1 = groups[i];
      const chromo2 = groups[i + 1];
      console.log("Board 1  = ", chromo1);
      console.log("Board 2  = ", chromo2);

      const crossOverArray = crossOver(chromo1, chromo2);
      crossOverr.push(...crossOverArray);
    }
    crossOverr.sort((a, b) => b.fitness - a.fitness);
    console.log("Sorted Cross : ", crossOverr);
    var totalFit = 0;
    crossOverr.forEach((chromosome) => {
      totalFit += chromosome.fitness;
    });
    console.log("Total Fit : ", totalFit);
    crossOverr.forEach((chromo) => {
      chromo.proba = chromo.fitness / totalFit;
      console.log("Proba : ", chromo.proba);
    });
    let cumulativeProbability = 0;
    crossOverr.forEach((chromo) => {
      chromo.starting = cumulativeProbability * 100;
      cumulativeProbability += chromo.proba;
      chromo.ending = cumulativeProbability * 100;
      // Update the state with a delay
      var array = chromo.bord;
      setBoard(array);
    });
    return crossOverr;
  };

  useEffect(() => {
    calculateConf();
  }, [board]);

  const createCells = () => {
    const newBoard = [];
    for (var i = 0; i < 8; i++) {
      const row = [];
      for (var j = i; j < i + 8; j++) {
        row.push(
          <Cell key={`${i}-${j}`} x={i} y={j - i} board={board} moves={moves} />
        );
      }
      newBoard.push(
        <div key={i} className="boardRow">
          {row}
        </div>
      );
      if (i === 3) {
        newBoard.push(<div key={i + 10} className="borderRow" />);
      }
    }
    return newBoard;
  };
  const clearEveryThing = () => {
    setMoves(Array(64).fill(0));
    setBoard(Array(64).fill(0));
    setStartText("Start");
  };

  const handleReset = () => {
    clearEveryThing();
    handleClick();
  };

  const [startText, setStartText] = useState("Start");
  const [disableReset, setDisabledReset] = useState(false);
  const [text, setText] = useState("");
  const [informations, setInfo] = useState(" ");
  return (
    <>
      <div className="titles">{text}</div>
      <div className="boardBody">
        {disableReset && (
          <div className="loaderRow">
            <div className="loader">
              <LuLoader2 />
            </div>
          </div>
        )}
        {createCells()}
      </div>
      <div className="buttons">
        <button
          onClick={generateChromosome}
          className="Button"
          disabled={disableReset}
        >
          {disableReset ? (
            <div className="loader">
              <LuLoader2 />
            </div>
          ) : (
            startText
          )}
        </button>
        <button
          className="Button"
          onClick={handleReset}
          disabled={disableReset}
        >
          <RiRestartLine />
        </button>
      </div>
      <div className="info">{informations}</div>
    </>
  );
};

export default Board;
