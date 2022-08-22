import React, { useState } from "react";
import { Button } from "../button";
import { Input } from "../input";
import { Paragraph } from "../paragraph";
import { Link } from "react-router-dom";
import { LoginPlayer } from "../../rest/room";

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
      <Paragraph text="Enter player name" size="large" />
      <Input
        className="mt-2"
        onChange={(event) => {
          setState({ name: event.target.value });
        }}
        size="large"
      />
      <div className="mt-12" />
      {state.name.length ? (
        <Link className="flex w-1/2 justify-center" to={"/player"}>
          <Button
            text="Join as player"
            size="large"
            onClick={async () => {
              PlayerName = state.name;
              PlayerId = await LoginPlayer({ playerName: state.name });
            }}
          />
        </Link>
      ) : (
        <div className="flex w-1/2 justify-center">
          <Button text="Join as player" size="large" disabled />
        </div>
      )}
      <div className="mt-8" />
      <Link className="flex w-1/2 justify-center" to={"/host"}>
        <Button text="Host screen" />
      </Link>
    </div>
  );
}
