import React, { useEffect, useState, useCallback } from "react";
import { Input, Button, List, Typography } from "antd";
import styled from "styled-components";

const { Item } = List;
const { Text, Title } = Typography;

const CenteredContainer = styled("div")`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Form = styled("form")`
  display: flex;
`;

const InputContainer = styled("div")`
  margin-bottom: 2rem;
`;

const capitalize = name => name.charAt(0).toUpperCase() + name.slice(1);

export default ({ socket, history }) => {
  const [connected, setConnected] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (socket) {
      socket.on("connected people", people => {
        setConnected(connected => [...people]);
      });
    }
  }, [socket]);

  const addPerson = newPerson =>
    setConnected(connected => [...connected, newPerson]);

  const handleChange = useCallback(
    ({ target: { value } }) => {
      setInput(value);
    },
    [setInput]
  );

  const handleSubmit = useCallback(
    event => {
      event.preventDefault();
      if (socket) {
        const name = capitalize(input);
        socket.emit("enter", name);
        setIsConnected(true);
        addPerson(name);
      }
    },
    [socket, input]
  );

  const handleStart = useCallback(() => {
    if (socket) {
      socket.emit("prepare game");
    }
  }, [socket, history]);

  return (
    <CenteredContainer>
      <Title>Boggle Multiplayer</Title>
      <InputContainer>
        {!isConnected ? (
          <Form onSubmit={handleSubmit}>
            <Input
              type="text"
              value={input}
              onChange={handleChange}
              placeholder="Enter your name"
            />
            <Button htmlType="submit">Connect</Button>
          </Form>
        ) : (
          <Button onClick={handleStart}>Start Game</Button>
        )}
      </InputContainer>
      {connected && connected.length > 0 && (
        <List
          bordered
          size="small"
          header={<h2>People connected</h2>}
          dataSource={connected}
          renderItem={person => <Item>{person}</Item>}
        />
      )}
    </CenteredContainer>
  );
};
