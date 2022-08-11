import React from "react";

interface inputProps {
  className?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  size?: "large" | "small" | "xs";
  password?: boolean;
  value?: string;
}

export function Input(props: inputProps) {
  return (
    <input
      className={`${
        props.className
      } border rounded border-custom-blue w-4/5 p-2 ${
        props.size === "large"
          ? "text-xl"
          : props.size === "small"
          ? ""
          : props.size === "xs"
          ? "text-sm"
          : "text-lg"
      } `}
      onChange={props.onChange}
      placeholder={props.placeholder}
      type={props.password ? "password" : ""}
      value={props.value}
    />
  );
}
