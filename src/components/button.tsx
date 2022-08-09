import React from "react";

interface buttonProps {
  className?: string;
  text: string;
  size?: "large" | "small";
  disabled?: boolean;
  width?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export function Button(props: buttonProps) {
  return (
    <button
      className={`${
        props.className
      } border rounded-lg bg-custom-blue text-white w-${
        props.width || "full"
      } ${
        props.size === "large"
          ? "h-40"
          : props.size === "small"
          ? "h-16"
          : "h-28"
      } ${props.disabled && "disabled opacity-50 cursor-default"}`}
      onClick={props.onClick}
    >
      <h1
        className={`${
          props.size === "large"
            ? "text-4xl"
            : props.size === "small"
            ? "text-lg"
            : "text-2xl"
        }`}
      >
        {props.text}
      </h1>
    </button>
  );
}
