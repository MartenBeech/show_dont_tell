import React, { useState } from "react";
import { Button } from "../button";
import { Input } from "../input";
import { Paragraph } from "../paragraph";
import { Link } from "react-router-dom";
import { LoginPlayer } from "../../rest/room";
import { RoomName } from "./login";

interface state {
  name: string;
}

export function Menu() {
  const [state, setState] = useState<state>({
    name: "",
  });
  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen">
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
        className="flex w-full justify-center"
        to={state.name.length ? "/player-waiting" : "/"}
      >
        <Button
          text="Join as player"
          size="large"
          disabled={!state.name.length}
          onClick={() => {
            LoginPlayer({ playerName: state.name, roomName: RoomName });
          }}
          width="1/2"
        />
      </Link>
      <div className="mt-8" />
      <Link className="flex w-full justify-center" to={"/host-waiting"}>
        <Button text="Host screen" width="1/2" />
      </Link>
    </div>
  );
}
