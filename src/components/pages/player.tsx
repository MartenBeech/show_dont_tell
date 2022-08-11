import { doc, onSnapshot } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../../rest/auth";
import {
  SubmitPrompt,
  Room,
  SubmitImage,
  StartVoting,
  SetImageWinning,
  NewPlayerTurn,
} from "../../rest/room";
import { Button } from "../button";
import { Input } from "../input";
import { Paragraph } from "../paragraph";
import { RoomName } from "./login";
import { PlayerName, PlayerId } from "./menu";

interface state {
  gameStarted: boolean;
  prompt: string;
  imageUrl: string;
  imageSubmitted: boolean;
  playerTurn: number;
  gameVoting: boolean;
  images: Array<string>;
  winnerChosen: boolean;
}

export function Player() {
  const [state, setState] = useState<state>({
    prompt: "",
    imageUrl: "",
    gameStarted: false,
    imageSubmitted: false,
    playerTurn: -1,
    gameVoting: false,
    images: [],
    winnerChosen: false,
  });

  let gameStarted = state.gameStarted;
  let playerTurn = state.playerTurn;
  let gameVoting = state.gameVoting;
  let images = [...state.images];
  let imageSubmitted = state.imageSubmitted;
  let winnerChosen = state.winnerChosen;
  let imageUrl = state.imageUrl;

  const messagesRef = doc(db, "rooms", RoomName);
  onSnapshot(messagesRef, (docSnap) => {
    if (docSnap.exists()) {
      const snapData = docSnap.data();
      const room = snapData as Room;

      if (room?.gameStarted && !gameStarted) {
        gameStarted = true;
      }
      if (state.gameStarted) {
        gameVoting = room.gameVoting;
        images = [...room.images];
        winnerChosen = room.imageWinning >= 0;
        if (images[PlayerId]) {
          imageSubmitted = true;
        }
        if (playerTurn != room.playerTurn) {
          imageSubmitted = false;
          (imageUrl = ""), (playerTurn = room.playerTurn);
        }
      }
      if (
        state.gameStarted != gameStarted ||
        state.playerTurn != playerTurn ||
        state.gameVoting != gameVoting ||
        JSON.stringify(state.images) != JSON.stringify(images) ||
        state.imageSubmitted != imageSubmitted ||
        state.winnerChosen != winnerChosen ||
        state.imageUrl != imageUrl
      )
        setState({
          ...state,
          gameStarted: gameStarted,
          playerTurn: playerTurn,
          gameVoting: gameVoting,
          images: images,
          imageSubmitted: imageSubmitted,
          winnerChosen: winnerChosen,
          imageUrl: imageUrl,
        });
    }
  });

  return (
    <>
      <Paragraph
        className="flex justify-center mt-2"
        text={PlayerName}
        size="small"
      />
      {state.gameStarted ? (
        <>
          {PlayerId === state.playerTurn ? (
            <>
              {state.gameVoting ? (
                <div className="flex justify-center items-center flex-wrap">
                  {state.images.map((image, index) => {
                    if (image && !state.winnerChosen) {
                      return (
                        <img
                          className="m-4 border cursor-pointer max-h-80"
                          key={index}
                          src={image}
                          width="40%"
                          onClick={() => {
                            SetImageWinning({ imageWinning: index });
                            const timer = setTimeout(
                              () => NewPlayerTurn(),
                              5000
                            );
                            setState({ ...state, winnerChosen: true });
                            return () => clearTimeout(timer);
                          }}
                        />
                      );
                    }
                  })}
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center w-full h-screen">
                  <Button
                    text="Start voting"
                    size="large"
                    width="1/2"
                    onClick={() => {
                      StartVoting();
                    }}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center w-full mt-20">
              {state.imageSubmitted ? (
                <Paragraph
                  className="flex justify-center w-4/5"
                  text="Waiting for other players"
                />
              ) : (
                <>
                  <Paragraph className="w-4/5" text="Paste image URL here" />
                  <Input
                    className="mt-2"
                    onChange={(event) => {
                      setState({ ...state, imageUrl: event.target.value });
                    }}
                    placeholder="www.google.com/image-url"
                    size="small"
                    value={state.imageUrl}
                  />
                  <div className="flex justify-center mt-4 w-full">
                    <Button
                      text="Use image"
                      size="small"
                      disabled={!state.imageUrl.length}
                      width="1/2"
                      onClick={() => {
                        SubmitImage({
                          player: PlayerName,
                          image: state.imageUrl,
                        });
                      }}
                    />
                  </div>
                </>
              )}
              {!!state.imageUrl.length && (
                <img className="mt-20" width={"80%"} src={state.imageUrl} />
              )}
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col justify-center items-center w-full h-screen">
          <Paragraph
            className="w-4/5"
            text="Add your own prompts while waiting for the game to start"
          />
          <Input
            className="mt-2"
            onChange={(event) => {
              setState({ ...state, prompt: event.target.value });
            }}
            placeholder="E.g. 'Describe Denmark with one image'"
            size="small"
            value={state.prompt}
          />
          <div className="flex justify-center mt-4 w-full">
            <Button
              text="Submit prompt"
              size="small"
              disabled={!state.prompt.length}
              width="1/2"
              onClick={() => {
                SubmitPrompt({ prompt: state.prompt });
                setState({ ...state, prompt: "" });
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
