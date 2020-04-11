import React, { useState, useCallback, useEffect } from "react";
import { List, Button } from "antd";
import styled from "styled-components";
import { CloseCircleFilled } from "@ant-design/icons";

const { Item } = List;

const Row = styled("div")`
  display: flex;
  border-right: 1px solid black;
  border-left: 1px solid black;
  border-bottom: 1px solid black;
  &:first-child {
    border-top: 1px solid black;
  }
`;

const Container = styled("div")`
  display: grid;
  place-content: center;
  height: 100vh;
`;

const Cell = styled("div")`
  font-size: 2rem;
  display: grid;
  place-content: center;
`;

const Close = styled("button")``;

const Form = styled("form")`
  height: 50px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
`;

const Input = styled("input")`
  font-size: 1.5rem;
  &:focus {
    outline: 0;
  }
`;

const Board = styled("div")`
  width: 300px;
  height: 300px;
  display: grid;
  grid-template: repeat(5, auto) / repeat(5, auto);
  margin-bottom: 30px;
  border-top: 1px solid black;
  border-left: 1px solid black;
  & > * {
    border-right: 1px solid black;
    border-bottom: 1px solid black;
  }
`;

const Add = styled(Button)`
  height: 100%;
`;

const ControlsContainer = styled("div")`
  display: flex;
  justify-content: space-between;
`;

const WordsList = styled(List)`
  overflow: scroll;
  max-height: "200px";
`;

const WordRow = styled("div")`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  font-size: 1.5rem;
`;

export default ({ board, words, addWord, removeWord, socket, history }) => {
  const [input, setInput] = useState("");
  const [seconds, setSeconds] = useState(null);
  const [minutes, setMinutes] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGetEnded] = useState(false);

  useEffect(() => {
    if (socket) {
      socket.on("time", time => {
        setSeconds(time % 60);
        setMinutes(Math.floor(time / 60));
      });

      socket.on("end game", () => {
        history.push("/score");
      });
    }
  }, [socket]);

  const handleInput = useCallback(
    ({ target: { value } }) => {
      setInput(value);
    },
    [setInput]
  );

  const handleSubmit = useCallback(
    event => {
      event.preventDefault();
      addWord(input);
      setInput("");
    },
    [input, setInput, addWord]
  );

  const handleRemove = useCallback(word => event => removeWord(word));

  const handleShuffle = useCallback(() => {
    if (socket) {
      socket.emit("generate board");
    }
  }, [socket]);

  const handleStart = useCallback(() => {
    if (socket) {
      socket.emit("start game");
      setGameStarted(true);
    }
  }, [socket]);

  return (
    <Container>
      {seconds !== null && (
        <h1>
          Time {minutes}:{seconds}
        </h1>
      )}
      <Board>
        {board &&
          board.map((row, i) =>
            row.map((cell, j) => <Cell key={`${i}${j}`}>{cell}</Cell>)
          )}
      </Board>
      {!gameStarted ? (
        <ControlsContainer>
          <Button onClick={handleShuffle}>Shuffle Board</Button>
          <Button onClick={handleStart}>Start Game</Button>
        </ControlsContainer>
      ) : (
        <>
          <Form onSubmit={handleSubmit}>
            <Input type="text" value={input} onChange={handleInput} />
            <Add type="submit">Add</Add>
          </Form>
          {words && words.length > 0 && (
            <WordsList
              bordered
              size="small"
              header={<h2>Words</h2>}
              dataSource={words}
              renderItem={word => (
                <Item>
                  <WordRow>
                    <span>{word}</span>
                    <CloseCircleFilled onClick={handleRemove(word)} />
                  </WordRow>
                </Item>
              )}
            />
          )}
        </>
      )}
    </Container>
  );
};
