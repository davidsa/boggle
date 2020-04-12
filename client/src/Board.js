import React from "react";
import styled from "styled-components";

const Board = styled("div")`
  display: grid;
  grid-template: repeat(5, 70px) / repeat(5, 70px);
  border-top: 1px solid black;
  border-left: 1px solid black;
  & > * {
    border-right: 1px solid black;
    border-bottom: 1px solid black;
  }
`;

const Cell = styled("div")`
  font-size: 2rem;
  display: grid;
  place-content: center;
`;

export default ({ board }) => {
  return (
    <Board>
      {board &&
        board.map((row, i) =>
          row.map((cell, j) => <Cell key={`${i}${j}`}>{cell}</Cell>)
        )}
    </Board>
  );
};
