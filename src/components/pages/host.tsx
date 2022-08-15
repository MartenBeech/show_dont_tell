import React, { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Button } from "../button";
import { Paragraph } from "../paragraph";
import { db } from "../../rest/auth";
import { RoomName } from "./login";
import { Room, StartGame } from "../../rest/room";
import { GetImages } from "../../rest/storage";

let gameStarted = false;
let gameVoting = false;
let imagesSubmitted = 0;
let prompts: Array<string>;
let prompt = "";
let imageWinning = -1;
let playerTurn = -1;
let players: Array<string>;

interface state {
  gameStarted: boolean;
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
    gameVoting: false,
    imagesSubmitted: 0,
    prompts: [],
    prompt: "",
    imageWinning: -1,
    playerTurn: -1,
    players: [],
  });

  const [imagesState, setImagesState] = useState<Array<string>>([]);

  useEffect(() => {
    if (state.gameVoting) {
      const getImages = async () => {
        const imageUrls = await GetImages({ roomName: RoomName });
        setImagesState(imageUrls);
      };
      getImages();
    }
  }, [state.gameVoting]);

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
        imagesSubmitted = room.imagesSubmitted;
        gameVoting = room.gameVoting;
        imageWinning = room.imageWinning;
        if (playerTurn != room.playerTurn) {
          playerTurnChanged();
          playerTurn = room.playerTurn;
        }
      }
      if (
        state.gameStarted != gameStarted ||
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
            {imagesState.map((image, index) => {
              if (image) {
                if (imageWinning === -1) {
                  return (
                    <img
                      className="m-4 border max-h-96 max-w-[45%]"
                      key={index}
                      src={image}
                    />
                  );
                } else {
                  return (
                    <img
                      className={`m-4 border max-h-96 max-w-[45%] ${
                        imageWinning === index
                          ? "border-green-500 border-4"
                          : "opacity-25"
                      }`}
                      key={index}
                      src={image}
                    />
                  );
                }
              }
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center w-full h-screen">
          <Paragraph
            className="mb-40 p-4"
            text={state.prompt.replace(
              "Judge",
              state.players[state.playerTurn]
            )}
            size="xl"
          />
          <Paragraph
            className="mb-8"
            text={`The Judge is ${state.players[state.playerTurn]}`}
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
        text={`Players in lobby: ${state.players.length}`}
        size="large"
      />
      <Link className="flex w-4/5 justify-center" to={"/host"}>
        <Button
          text="Start game"
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
