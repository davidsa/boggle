import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { CloseCircleFilled } from "@ant-design/icons";
import { List, Button } from "antd";

const { Item } = List;

const WordRow = styled("div")`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  font-size: 1.5rem;
`;

const Container = styled("div")`
  display: flex;
  flex-direction: column;
`;

const Header = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ScoreList = styled(List)`
  flex: 1;
  overflow: scroll;
`;

export default ({ socket, words: w, reset }) => {
  const [words, setWords] = useState(
    w.map(word => ({ value: word, strike: false }))
  );

  const handlePlayAgain = useCallback(() => {
    if (socket) {
      reset();
      socket.emit("prepare game");
    }
  }, [socket]);

  const onStrike = useCallback(index => event => {
    setWords(words =>
      words.map((word, i) => {
        if (i === index) {
          return { value: word.value, strike: !word.strike };
        }
        return word;
      })
    );
  });

  const score = words.reduce(
    (acc, { value, strike }) => (strike ? acc : acc + value.length),
    0
  );

  return (
    <Container>
      <Header>
        <h1>Score: {score}</h1>
        <Button onClick={handlePlayAgain}>Play Again</Button>
      </Header>
      <ScoreList
        bordered
        size="small"
        header={<h2>Words</h2>}
        dataSource={words}
        renderItem={({ value, strike }, index) => (
          <Item>
            <WordRow>
              <span style={{ textDecoration: strike ? "line-through" : "" }}>
                {value}
              </span>
              <CloseCircleFilled onClick={onStrike(index)} />
            </WordRow>
          </Item>
        )}
      />
    </Container>
  );
};
