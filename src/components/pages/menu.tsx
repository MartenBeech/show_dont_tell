import React, { useState } from "react";
import { Button } from "../button";
import { Input } from "../input";
import { Paragraph } from "../paragraph";
import { Link } from "react-router-dom";
import { LoginPlayer } from "../../rest/room";
import { motion } from "framer-motion";
import { RoomName } from "./login";

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
    <motion.div
      className="flex flex-col justify-center items-center w-full min-h-screen"
      key={"menu"}
      initial={{ opacity: 0, x: -200 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <Paragraph
        className="flex justify-center mb-12"
        text={`Room code: ${RoomName}`}
        size="small"
      />
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
    </motion.div>
  );
}
