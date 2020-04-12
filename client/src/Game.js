import React, { useState, useCallback, useEffect } from "react";
import { List, Button, Input } from "antd";
import styled from "styled-components";
import { CloseCircleFilled } from "@ant-design/icons";
import Board from "./Board";

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
  display: flex;
  height: 100vh;
  justify-content: space-evenly;
  align-items: center;
`;

const Close = styled("button")``;

const Form = styled("form")`
  height: 50px;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
`;

const WordInput = styled(Input)`
  flex: 1;
  font-size: 1.5rem;
`;

const Add = styled(Button)`
  height: 100%;
  width: 70px;
`;

const ControlsContainer = styled("div")`
  display: flex;
  justify-content: space-between;
`;

const WordsList = styled(List)`
  overflow: scroll;
  width: 40vw;
  max-height: 450px;
`;

const WordRow = styled("div")`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  font-size: 1.5rem;
`;

const BoardContainer = styled("div")`
  display: flex;
  flex-direction: column;
`;

const ContentContainer = styled("div")``;

export default ({ board, words, addWord, removeWord, socket, history }) => {
  const [input, setInput] = useState("");
  const [seconds, setSeconds] = useState(null);
  const [minutes, setMinutes] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGetEnded] = useState(false);

  useEffect(() => {
    if (socket) {
      socket.on("game started", () => {
        setGameStarted(true);
      });

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
    }
  }, [socket]);

  return (
    <Container>
      <BoardContainer>
        {gameStarted && seconds !== null && (
          <h1>
            Time {minutes}:{seconds}
          </h1>
        )}
        <Board board={board} />
        {gameStarted && (
          <Form onSubmit={handleSubmit}>
            <WordInput type="text" value={input} onChange={handleInput} />
            <Add htmlType="submit">Add</Add>
          </Form>
        )}
      </BoardContainer>
      <ContentContainer>
        {!gameStarted ? (
          <ControlsContainer>
            <Button onClick={handleShuffle}>Shuffle Board</Button>
            <Button onClick={handleStart}>Start Game</Button>
          </ControlsContainer>
        ) : (
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
      </ContentContainer>
    </Container>
  );
};
