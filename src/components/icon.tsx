import React from "react";
import shush from "../images/shush.png";

interface iconProps {
  className?: string;
}

export function Icon(props: iconProps) {
  return <img className={props.className} src={shush} />;
}
