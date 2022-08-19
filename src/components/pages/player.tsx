import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../rest/auth";
import {
  SubmitPrompt,
  Room,
  StartVoting,
  SetImageWinning,
  NewPlayerTurn,
  SubmitImage,
} from "../../rest/room";
import { GetImages } from "../../rest/storage";
import { Button } from "../button";
import { Icon } from "../icon";
import { FileInput, Input } from "../input";
import { Paragraph } from "../paragraph";
import { RoomName } from "./login";
import { PlayerName, PlayerId } from "./menu";

let gameStarted = false;
let playerTurn = -1;
let gameVoting = false;
let winnerChosen = false;

interface state {
  gameStarted: boolean;
  prompt: string;
  playerTurn: number;
  gameVoting: boolean;
  winnerChosen: boolean;
}

export function Player() {
  const [state, setState] = useState<state>({
    prompt: "",
    gameStarted: false,
    playerTurn: -1,
    gameVoting: false,
    winnerChosen: false,
  });
  const [imagesState, setImagesState] = useState<Array<string>>([]);
  const [imageSubmittedState, setImageSubmittedState] = useState(false);
  const [imageUrlState, setImageUrlState] = useState("");
  const [errorMsgState, setErrorMsgState] = useState("");
  const [successMsgState, setSuccessMsgState] = useState("");

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

      if (room?.gameStarted && !gameStarted) {
        gameStarted = true;
      }
      if (state.gameStarted) {
        gameVoting = room.gameVoting;
        winnerChosen = room.imageWinning >= 0;
        if (playerTurn != room.playerTurn) {
          setImageSubmittedState(false);
          setImageUrlState("");
          playerTurn = room.playerTurn;
        }
      }
      if (
        state.gameStarted != gameStarted ||
        state.playerTurn != playerTurn ||
        state.gameVoting != gameVoting ||
        state.winnerChosen != winnerChosen
      )
        setState({
          ...state,
          gameStarted: gameStarted,
          playerTurn: playerTurn,
          gameVoting: gameVoting,
          winnerChosen: winnerChosen,
        });
    }
  });

  return (
    <div className="h-full">
      <Paragraph
        className="flex justify-center pt-2 mb-8"
        text={PlayerName}
        size="small"
      />
      {state.gameStarted ? (
        <>
          {PlayerId === state.playerTurn ? (
            <>
              {state.gameVoting ? (
                <div className="flex justify-center items-center flex-wrap">
                  {imagesState.map((image, index) => {
                    if (image && !state.winnerChosen) {
                      return (
                        <img
                          className="m-4 border cursor-pointer max-h-80 max-w-[40%]"
                          key={index}
                          src={image}
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
                <div className="flex flex-col justify-center items-center w-full">
                  <Icon className="mb-20" />
                  <Button
                    text="Start voting"
                    size="large"
                    width="2/3"
                    onClick={() => {
                      StartVoting();
                    }}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center w-full mt-12">
              {imageSubmittedState ? (
                <Paragraph
                  className="flex justify-center w-4/5"
                  text="Waiting for other players"
                  size="large"
                />
              ) : (
                <>
                  <Paragraph
                    className="w-4/5"
                    text="Paste image URL or upload from device:"
                  />
                  <Input
                    className="mt-2 h-10"
                    onChange={(event) => {
                      setImageUrlState(event.target.value);
                      setErrorMsgState("");
                    }}
                    placeholder="www.google.com/image-url"
                    size="xs"
                    value={imageUrlState}
                  />
                  <FileInput
                    classname="w-4/5 mt-4"
                    onChange={(event) => {
                      const url = URL.createObjectURL(event.target.files[0]);
                      setImageUrlState(url);
                      setErrorMsgState("");
                    }}
                  />
                  <div className="flex justify-center mt-8 w-full">
                    <Button
                      text="Submit image"
                      size="small"
                      disabled={!imageUrlState.length}
                      width="1/2"
                      onClick={async () => {
                        try {
                          const response = await fetch(imageUrlState);
                          const blob = await response.blob();
                          const image = new File(
                            [blob],
                            `${Math.floor(Math.random() * 65536)}${PlayerId}`,
                            {
                              type: blob.type,
                            }
                          );
                          SubmitImage({ image: image });
                          setImageSubmittedState(true);
                        } catch (error) {
                          setErrorMsgState("(Invalid image format)");
                        }
                      }}
                    />
                  </div>
                  <Paragraph
                    className="text-custom-red-light"
                    text={errorMsgState}
                  />
                </>
              )}
              {imageUrlState && (
                <img className="mt-12 mb-8 max-w-[80%]" src={imageUrlState} />
              )}
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col justify-center items-center w-full">
          <Icon className="mb-8" />
          <Paragraph
            className="w-4/5 mb-2"
            text="Add your own prompts while waiting for the game to start."
          />
          <Paragraph
            className="w-4/5"
            text="Typing 'Judge' will turn into the name of the player currently voting."
          />
          <Input
            className="mt-2"
            onChange={(event) => {
              setState({ ...state, prompt: event.target.value });
              setSuccessMsgState("");
            }}
            placeholder="E.g. 'Where do you see Judge in 10 years?'"
            size="xs"
            value={state.prompt}
          />
          <div className="flex justify-center mt-4 w-full">
            <Button
              className="mb-4"
              text="Submit prompt"
              size="small"
              disabled={!state.prompt.length}
              width="1/2"
              onClick={() => {
                SubmitPrompt({ prompt: state.prompt });
                setState({ ...state, prompt: "" });
                const rnd = Math.floor(Math.random() * 10);
                setSuccessMsgState(
                  `Successfully submitted prompt.${
                    rnd === 0
                      ? " Good one!"
                      : rnd === 1
                      ? " Very funny!"
                      : rnd === 2
                      ? " Best one so far!"
                      : rnd === 3
                      ? " Literally a good prompt!"
                      : rnd === 4
                      ? " Super duper!"
                      : rnd === 5
                      ? " Woohoooo!"
                      : rnd === 6
                      ? " You did amazing!"
                      : rnd === 7
                      ? " We are all very proud of you!"
                      : rnd === 8
                      ? " Now give me another one!"
                      : rnd === 9
                      ? " I could never come up with that!"
                      : ""
                  }`
                );
              }}
            />
          </div>
          <Paragraph
            className="flex justify-center w-4/5 text-custom-green"
            text={successMsgState}
            size="xs"
          />
        </div>
      )}
    </div>
  );
}
