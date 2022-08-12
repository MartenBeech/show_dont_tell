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

interface fileInputProps {
  classname?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export function FileInput(props: fileInputProps) {
  return (
    <div className={props.classname}>
      <label className={`w-1/2 flex cursor-pointer h-10`}>
        <div className="flex justify-center items-center w-full border border-black rounded px-2 py-1 bg-custom-gray-dark hover:bg-details-light font-italic">
          Upload image
        </div>
        <input
          className="w-0"
          type={"file"}
          style={{ visibility: "hidden" }}
          accept={"image/*"}
          onChange={props.onChange}
        />
      </label>
    </div>
  );
}
