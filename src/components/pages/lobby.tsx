import React, { useState } from "react";
import { Paragraph } from "../paragraph";
import { Checkbox, Input } from "../input";
import { Button } from "../button";
import { CreateRoom, GetRoomExists, RestartGame } from "../../rest/room";
import { Icon } from "../icon";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export let RoomName = "";

interface lobbyProps {
  setRoomName?: React.Dispatch<React.SetStateAction<string>>;
}

export function Lobby(props: lobbyProps) {
  const [roomNameState, setRoomNameState] = useState("");
  const [defaultPromptsState, setDefaultPromptsState] = useState(true);
  const [errorMsgState, setErrorMsgState] = useState("");

  const handleJoinRoom = async () => {
    const roomExists = await GetRoomExists({ roomName: roomNameState });
    if (roomExists) {
      RoomName = roomNameState;
      props.setRoomName(roomNameState);
      RestartGame();
    } else {
      setErrorMsgState("Room does not exist");
    }
  };

  const handleCreateRoom = async () => {
    const roomExists = await GetRoomExists({ roomName: roomNameState });
    if (roomExists) {
      setErrorMsgState("Room already exists");
    } else {
      RoomName = roomNameState;
      props.setRoomName(roomNameState);
      CreateRoom({ includeDefaultProps: defaultPromptsState });
    }
  };

  return (
    <motion.div
      className="flex w-full min-h-screen justify-center items-center"
      key={"login"}
      initial={{ opacity: 0, x: -200 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="flex flex-col w-full items-center">
        <Paragraph className="mb-4" text="SHOW DON'T TELL" size="xl" />
        <Icon className="mb-8" />
        <Paragraph text="Room Name" size="large" />
        <Input
          className="mt-2"
          onChange={(e) => {
            setRoomNameState(e.target.value.toLocaleUpperCase());
            setErrorMsgState("");
          }}
          value={roomNameState}
        />
        <Paragraph
          className="text-custom-red-light mt-4"
          text={errorMsgState}
        />
        {!roomNameState ? (
          <Button
            className="mt-8"
            text="Join Room"
            size="small"
            width="1/2"
            disabled
          />
        ) : (
          <Link className="flex justify-center w-1/2 mt-8" to={"/menu"}>
            <Button
              text="Join Room"
              size="small"
              width="full"
              disabled={!roomNameState}
              onClick={() => {
                handleJoinRoom();
              }}
            />
          </Link>
        )}
        {!roomNameState ? (
          <Button
            className="mt-8"
            text="Create Room"
            size="small"
            width="1/2"
            disabled
          />
        ) : (
          <Link className="flex justify-center w-1/2 mt-8" to={"/menu"}>
            <Button
              text="Create Room"
              size="small"
              width="full"
              disabled={!roomNameState}
              onClick={() => {
                handleCreateRoom();
              }}
            />
          </Link>
        )}
        <div
          className="flex items-center mt-2 cursor-default"
          onClick={() => {
            setDefaultPromptsState(!defaultPromptsState);
          }}
        >
          <Paragraph className="mr-2" text="Add default prompts" size="small" />
          <Checkbox
            value={defaultPromptsState}
            size="small"
            onChange={() => setDefaultPromptsState(!defaultPromptsState)}
          />
        </div>
      </div>
    </motion.div>
  );
}
