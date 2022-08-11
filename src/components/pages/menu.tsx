import React, { useState } from "react";
import { Button } from "../button";
import { Input } from "../input";
import { Paragraph } from "../paragraph";
import { Link } from "react-router-dom";
import { LoginPlayer } from "../../rest/room";
import { Icon } from "../icon";

export let PlayerName: string;
export let PlayerId: number;

interface state {
  name: string;
}

export function Menu() {
  const [state, setState] = useState<state>({
    name: "",
  });
  return (
    <div className="flex flex-col justify-center items-center w-full h-screen">
      <Icon className="mb-12" />
      <Paragraph text="Enter player name" size="large" />
      <Input
        className="mt-2"
        onChange={(event) => {
          setState({ name: event.target.value });
        }}
        size="large"
      />
      <div className="mt-12" />
      <Link
        className="flex w-1/2 justify-center"
        to={state.name.length ? "/player" : "/"}
      >
        <Button
          text="Join as player"
          size="large"
          disabled={!state.name.length}
          onClick={async () => {
            PlayerName = state.name;
            PlayerId = await LoginPlayer({ playerName: state.name });
          }}
        />
      </Link>
      <div className="mt-8" />
      <Link className="flex w-1/2 justify-center" to={"/host"}>
        <Button text="Host screen" />
      </Link>
    </div>
  );
}
