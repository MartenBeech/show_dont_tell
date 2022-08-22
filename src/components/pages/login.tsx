import React, { useState } from "react";
import buffer from "buffer";
import { Auth } from "../../rest/auth";
import { Paragraph } from "../paragraph";
import { Input } from "../input";
import { Button } from "../button";
import { CreateRoom } from "../../rest/room";
import { Icon } from "../icon";
import { motion } from "framer-motion";

export let RoomName = "";

interface loginProps {
  setToken: React.Dispatch<React.SetStateAction<string>>;
}

export function Login(props: loginProps) {
  const [roomName, setRoomName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const authenticated = await Auth({
      username: process.env.REACT_APP_AUTH_EMAIL,
      password,
    });

    if (authenticated) {
      const buff = buffer.Buffer.from(`${password}`).toString("base64");
      const basicAuth = `Basic ${buff}`;
      RoomName = roomName;
      CreateRoom();

      const token = basicAuth;
      props.setToken(token);
    }
  };

  return (
    <motion.div
      className="flex w-full h-screen justify-center items-center"
      key={"login"}
      initial={{ opacity: 0, x: -200 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="flex flex-col w-full items-center">
        <Paragraph className="mb-4" text="SHOW DON'T TELL" size="xl" />
        <Icon className="mb-8" />
        <Paragraph text="Room name" size="large" />
        <Input
          className="mt-2"
          onChange={(e) => setRoomName(e.target.value)}
          value={roomName}
        />
        <form
          className="flex flex-col items-center w-full"
          onSubmit={(event) => {
            event.preventDefault();
            if (roomName && password) {
              handleSubmit(event);
            }
          }}
        >
          <Paragraph className="mt-8" text="Password" size="large" />
          <Input
            className="mt-2"
            password
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <Button
            className="mt-8"
            text="Log in"
            size="small"
            width="1/2"
            disabled={!roomName || !password}
          />
        </form>
      </div>
    </motion.div>
  );
}
