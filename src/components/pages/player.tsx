import React, { useState } from "react";
import { Button } from "../button";
import { Input } from "../input";
import { Paragraph } from "../paragraph";

interface playerProps {
  gameStarted: boolean;
}

interface state {
  prompt: string;
  imageUrl: string;
}

export function Player(props: playerProps) {
  const [state, setState] = useState<state>({ prompt: "", imageUrl: "" });

  return props.gameStarted ? (
    <div className="flex flex-col items-center w-screen mt-20">
      <Paragraph className="mr-8 ml-8" text="Paste image URL here" />
      <Input
        className="mt-2"
        onChange={(event) => {
          setState({ ...state, imageUrl: event.target.value });
        }}
        placeholder="www.google.com/image-url"
        size="small"
      />
      <div className="mt-4">
        <Button
          text="Use image"
          size="small"
          disabled={!state.imageUrl.length}
          width="1/2"
        />
      </div>
      {!!state.imageUrl.length && (
        <img className="mt-20" width={"80%"} src={state.imageUrl} />
      )}
    </div>
  ) : (
    <div className="flex flex-col justify-center items-center w-screen h-screen">
      <Paragraph
        className="mr-8 ml-8"
        text="Add your own prompts while waiting for the game to start"
      />
      <Input
        className="mt-2"
        onChange={(event) => {
          setState({ ...state, prompt: event.target.value });
        }}
        placeholder="E.g. 'Describe Denmark with one image'"
        size="small"
      />
      <div className="flex justify-center mt-4 w-full">
        <Button
          text="Submit prompt"
          size="small"
          disabled={!state.prompt.length}
          width="1/2"
        />
      </div>
    </div>
  );
}
