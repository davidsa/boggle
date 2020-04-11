import React, { Component, useEffect, useState, useCallback } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import io from "socket.io-client";

import Home from "./Home";
import Game from "./Game";
import Score from "./Score";

export default function () {
  const [socket, setSocket] = useState();
  const [board, setBoard] = useState();
  const [words, addWord] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const ioSocket = io("http://localhost:3000");

    ioSocket.on("prepare game", board => {
      history.push("/game");
      setBoard(board);
    });

    ioSocket.on("board generated", board => {
      console.log(board);
      setBoard(board);
    });

    setSocket(ioSocket);
    return () => ioSocket.disconnect();
  }, []);

  const handleAddWord = useCallback(word => {
    addWord(words =>
      word === "" || words.includes(word) ? words : [word, ...words]
    );
  });

  const handleRemoveWord = useCallback(word => {
    addWord(words => words.filter(w => w !== word));
  });

  const resetWords = useCallback(() => {
    addWord([]);
  });

  return (
    <Switch>
      <Route
        path="/"
        exact
        render={props => <Home {...props} socket={socket} />}
      />
      <Route
        path="/game"
        exact
        render={props => (
          <Game
            {...props}
            board={board}
            socket={socket}
            words={words}
            addWord={handleAddWord}
            removeWord={handleRemoveWord}
          />
        )}
      />
      <Route
        path="/score"
        exact
        render={props => (
          <Score {...props} words={words} socket={socket} reset={resetWords} />
        )}
      />
    </Switch>
  );
}
