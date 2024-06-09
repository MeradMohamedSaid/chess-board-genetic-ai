import React from "react";

import q from "../assets/q.png"; // value 1 queen
import b from "../assets/b.png"; //value 2 bishop
import k from "../assets/k.png"; // value 3 knight
import r from "../assets/r.png"; //value 4 rock
import { useEffect, useRef, useState } from "react";

const Cell = ({ x, y, board, updateBoard, moves }) => {
  const isBlack = (y % 2 == 0 && x % 2 == 0) || (y % 2 != 0 && x % 2 != 0);
  const index = x * 8 + y;
  const [value, setValue] = useState(board[index]);
  const block = useRef(null);
  const [isMove, setIsMove] = useState(false);
  const [isConflict, setIsConflict] = useState(false);

  const getRandomValue = () => {
    return Math.floor(Math.random() * (100 + 1));
  };

  useEffect(() => {
    setValue(board[index]);
  }, [board]);

  useEffect(() => {
    if (moves[index] === 1) {
      setIsMove(true);
    } else {
      setIsMove(false);
    }
  }, [moves]);

  const getIndex = (x, y) => {
    return x * 8 + y;
  };

  return (
    <>
      <div
        className="cell"
        style={{
          background: isBlack ? "#FCE399" : "#FFF",
        }}
      >
        <div
          className="pieceHolder"
          style={{
            background: "transparent",
            ...(isMove && { background: "rgba(255, 0, 0, 0.5)" }),
            ...(isConflict && { background: "rgba(255, 0, 0, 0.2)" }),
          }}
        >
          {value === 1 && <img src={q} alt="queen" className="piece" />}
          {value === 2 && <img src={b} alt="bishop" className="piece" />}
          {value === 3 && <img src={k} alt="king" className="piece" />}
          {value === 4 && <img src={r} alt="rook" className="piece" />}
        </div>
      </div>
    </>
  );
};

export default Cell;
