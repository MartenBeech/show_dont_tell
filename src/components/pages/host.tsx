import React, { useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Button } from "../button";
import { Paragraph } from "../paragraph";
import { db } from "../../rest/auth";
import { RoomName } from "./login";
import { Room, StartGame } from "../../rest/room";

let gameStarted = false;
let images: Array<string>;
let gameVoting = false;
let imagesSubmitted = 0;
let prompts: Array<string>;
let prompt = "";
let imageWinning = -1;
let playerTurn = -1;
let players: Array<string>;

interface state {
  gameStarted: boolean;
  images: Array<string>;
  gameVoting: boolean;
  imagesSubmitted: number;
  prompts: Array<string>;
  prompt: string;
  imageWinning: number;
  playerTurn: number;
  players: Array<string>;
}

export const playerTurnChanged = () => {
  const rnd = Math.floor(Math.random() * (prompts.length - 1));
  prompt = prompts[rnd];
  prompts.splice(rnd, 1);
};

export function Host() {
  const [state, setState] = useState<state>({
    gameStarted: false,
    images: [],
    gameVoting: false,
    imagesSubmitted: 0,
    prompts: [],
    prompt: "",
    imageWinning: -1,
    playerTurn: -1,
    players: [],
  });

  const messagesRef = doc(db, "rooms", RoomName);
  onSnapshot(messagesRef, (docSnap) => {
    if (docSnap.exists()) {
      const snapData = docSnap.data();
      const room = snapData as Room;

      if (!room.gameStarted && !prompt) {
        players = [...room.players];
        prompts = [...room.prompts];
      }
      if (room.gameStarted && !gameStarted) {
        players = [...room.players];
        gameStarted = true;
      }
      if (state.gameStarted) {
        let imagesCount = 0;
        room.images.map((image) => {
          if (image) {
            imagesCount++;
          }
        });
        images = [...room.images];
        imagesSubmitted = imagesCount;
        gameVoting = room.gameVoting;
        imageWinning = room.imageWinning;
        if (playerTurn != room.playerTurn) {
          playerTurnChanged();
          playerTurn = room.playerTurn;
        }
      }
      if (
        state.gameStarted != gameStarted ||
        JSON.stringify(state.images) != JSON.stringify(images) ||
        state.imagesSubmitted != imagesSubmitted ||
        state.gameVoting != gameVoting ||
        JSON.stringify(state.prompts) != JSON.stringify(prompts) ||
        state.prompt != prompt ||
        state.imageWinning != imageWinning ||
        state.playerTurn != playerTurn ||
        JSON.stringify(state.players) != JSON.stringify(players)
      ) {
        setState({
          ...state,
          gameStarted: gameStarted,
          images: images,
          imagesSubmitted: imagesSubmitted,
          gameVoting: gameVoting,
          prompts: prompts,
          prompt: prompt,
          imageWinning: imageWinning,
          playerTurn: playerTurn,
          players: players,
        });
      }
    }
  });

  return state.gameStarted ? (
    <>
      {state.gameVoting ? (
        <div className="flex flex-col">
          <div className="flex justify-center">
            <Paragraph text={state.prompt} size="large" />
          </div>
          <div className="flex justify-center items-center flex-wrap">
            {state.images.map((image, index) => {
              if (image) {
                if (imageWinning === -1) {
                  return (
                    <img
                      className="m-4 border max-h-80"
                      key={index}
                      src={image}
                      width="40%"
                    />
                  );
                } else {
                  return (
                    <img
                      className={`m-4 border max-h-80 ${
                        imageWinning === index
                          ? "border-green-500 border-4"
                          : "opacity-25"
                      }`}
                      key={index}
                      src={image}
                      width="40%"
                    />
                  );
                }
              }
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center w-full h-screen">
          <Paragraph className="mb-40" text={state.prompt} size="xl" />
          <Paragraph
            className="mb-8"
            text={`${state.players[state.playerTurn]} is voting`}
            size="xl"
          />
          <Paragraph
            text={`${state.imagesSubmitted} images submitted`}
            size="large"
          />
        </div>
      )}
    </>
  ) : (
    <div className="flex flex-col justify-center items-center w-full h-screen">
      <Paragraph
        className="mb-2"
        text={`Players: ${state.players.length}`}
        size="large"
      />
      <Link className="flex w-4/5 justify-center" to={"/host"}>
        <Button
          text="Start"
          size="large"
          onClick={() => {
            prompts = [...state.prompts];
            StartGame();
          }}
        />
      </Link>
      {state.players.map((player, index) => {
        return (
          <Paragraph className="mt-4" text={player} key={index} size="large" />
        );
      })}
    </div>
  );
}
