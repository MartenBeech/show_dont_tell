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
      } border rounded border-custom-blue-dark w-4/5 p-2 bg-custom-white ${
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

interface checkboxProps {
  classname?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  value?: boolean;
  size?: "large" | "small";
}

export function Checkbox(props: checkboxProps) {
  return (
    <input
      className={`${props.classname} ${
        props.size === "large"
          ? "w-8 h-8"
          : props.size === "small"
          ? "w-4 h-4"
          : "w-5 h-5"
      }`}
      type="checkbox"
      onChange={props.onChange}
      checked={props.value}
    />
  );
}
