import React, { useEffect, useState } from "react";
import { Login } from "./components/pages/login";
import { Routing } from "./components/routing";

export enum ScreenSize {
  small,
  medium,
  large,
}

export function App() {
  const [token, setToken] = useState("");
  const [screenSize, setScreenSize] = useState({} as ScreenSize);

  useEffect(() => {
    updateScreenSize(window.innerWidth);
  }, []);

  window.addEventListener("resize", () => {
    updateScreenSize(window.innerWidth);
  });

  function updateScreenSize(size: number) {
    setScreenSize(
      size <= 600
        ? ScreenSize.small
        : size <= 1200
        ? ScreenSize.medium
        : ScreenSize.large
    );
  }

  return (
    <div className="flex justify-center">
      <div
        className={
          screenSize === ScreenSize.small
            ? "w-full"
            : screenSize === ScreenSize.medium
            ? "w-2/3"
            : screenSize === ScreenSize.large
            ? "w-1/2"
            : ""
        }
      >
        <div className="border-l border-r bg-custom-gray">
          {!token ? (
            <Login setToken={setToken} />
          ) : (
            <div className="h-screen bg-custom-gray">
              <Routing />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
