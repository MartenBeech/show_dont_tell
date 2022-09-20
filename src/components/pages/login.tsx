import React, { useState } from "react";
import buffer from "buffer";
import { Auth } from "../../rest/auth";
import { Paragraph } from "../paragraph";
import { Input } from "../input";
import { Button } from "../button";
import { Icon } from "../icon";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface loginProps {
  setToken: React.Dispatch<React.SetStateAction<string>>;
}

export function Login(props: loginProps) {
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    const authenticated = await Auth({
      username: process.env.REACT_APP_AUTH_EMAIL,
      password,
    });

    if (authenticated) {
      const buff = buffer.Buffer.from(`${password}`).toString("base64");
      const basicAuth = `Basic ${buff}`;

      const token = basicAuth;
      props.setToken(token);
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
        <form
          className="flex flex-col items-center w-full"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <Paragraph className="mt-8" text="Password" size="large" />
          <Input
            className="mt-2"
            password
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />

          <Link className="flex justify-center w-1/2 mt-8" to={"/lobby"}>
            <Button
              text="Log in"
              size="small"
              width="full"
              onClick={() => {
                handleSubmit();
              }}
            />
          </Link>
        </form>
      </div>
    </motion.div>
  );
}
