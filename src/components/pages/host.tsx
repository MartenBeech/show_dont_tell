import React, { useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Button } from "../button";
import { Paragraph } from "../paragraph";
import { db } from "../../rest/auth";
import { RoomName } from "./login";
import { Room } from "../../rest/room";

interface state {
  players: Array<string>;
}

interface hostProps {
  gameStarted: boolean;
}

export function Host(props: hostProps) {
  const [state, setState] = useState<state>({ players: [] });

  const messagesRef = doc(db, "rooms", RoomName);
  onSnapshot(messagesRef, (docSnap) => {
    if (docSnap.exists()) {
      const snapData = docSnap.data();
      const room = snapData as Room;
      if (room?.players) {
        setState({ players: room.players });
      }
    }
  });

  return props.gameStarted ? (
    <></>
  ) : (
    <div className="flex flex-col justify-center items-center w-full h-screen">
      <Paragraph
        className="mb-2"
        text={`Players: ${state.players.length}`}
        size="large"
      />
      <Link className="flex w-full justify-center" to={"/host"}>
        <Button text="Start" size="large" width="4/5" />
      </Link>
      {state.players.map((player, index) => {
        return (
          <Paragraph className="mt-4" text={player} key={index} size="large" />
        );
      })}
    </div>
  );
}
