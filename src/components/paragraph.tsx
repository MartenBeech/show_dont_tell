import React from "react";

interface paragraphProps {
  className?: string;
  text: string;
  size?: "xl" | "large" | "small" | "xs";
}

export function Paragraph(props: paragraphProps) {
  return (
    <h1
      className={`${props.className} font-cambria ${
        props.size === "xl"
          ? "text-4xl"
          : props.size === "large"
          ? "text-2xl"
          : props.size === "small"
          ? "text-lg"
          : props.size === "xs"
          ? ""
          : "text-xl"
      }`}
    >
      {props.text}
    </h1>
  );
}
