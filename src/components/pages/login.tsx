import React, { useState } from "react";
import buffer from "buffer";
import { Auth } from "../../rest/auth";
import { Paragraph } from "../paragraph";
import { Input } from "../input";
import { Button } from "../button";
import { CreateRoom } from "../../rest/room";
import { Icon } from "../icon";

export let RoomName = "";

interface loginProps {
  setToken: React.Dispatch<React.SetStateAction<string>>;
}

export function Login(props: loginProps) {
  const [roomName, setRoomName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    <div className="flex w-full h-screen justify-center items-center">
      <form
        className="flex flex-col w-full items-center"
        onSubmit={(event) => {
          handleSubmit(event);
        }}
      >
        <Paragraph className="mb-12" text="SHOW DON'T TELL" size="xl" />
        <Icon className="mb-12" />
        <Paragraph text="Room name" size="large" />
        <Input className="mt-2" onChange={(e) => setRoomName(e.target.value)} />
        <Paragraph className="mt-8" text="Password" size="large" />
        <Input
          className="mt-2"
          password
          onChange={(e) => setPassword(e.target.value)}
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
  );
}
