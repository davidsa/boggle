import React, { Component, useEffect, useState, useCallback } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import io from "socket.io-client";

import Home from "./Home";
import Game from "./Game";
import Score from "./Score";

function rotate(arr) {
  const n = arr.length;
  const newGrid = arr.map(() => []);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      newGrid[i][j] = arr[n - j - 1][i];
    }
  }
  return newGrid;
}

export default function () {
  const [socket, setSocket] = useState();
  const [board, setBoard] = useState();
  const [words, addWord] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on("prepare game", board => {
      history.push("/game");
      addWord([]);
      setBoard(board);
    });

    socket.on("board generated", board => {
      setBoard(board);
    });

    setSocket(socket);
    return () => socket.disconnect();
  }, []);

  const handleAddWord = useCallback(word => {
    addWord(words =>
      word === "" || words.includes(word) ? words : [word, ...words]
    );
  });

  const handleRemoveWord = useCallback(word => {
    addWord(words => words.filter(w => w !== word));
  });

  const handleRotate = useCallback(() => {
    const newBoard = rotate(board);
    setBoard(newBoard);
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
            onRotate={handleRotate}
          />
        )}
      />
      <Route
        path="/score"
        exact
        render={props => (
          <Score {...props} words={words} socket={socket} board={board} />
        )}
      />
    </Switch>
  );
}
