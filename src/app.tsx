import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
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
    <div className={`flex justify-center bg-custom-white`}>
      <div
        className={`bg-gradient-to-b from-custom-gray-light to-custom-gray-dark ${
          screenSize === ScreenSize.small
            ? "w-full"
            : screenSize === ScreenSize.medium
            ? "w-2/3"
            : screenSize === ScreenSize.large
            ? "w-1/2"
            : ""
        }`}
      >
        <AnimatePresence>
          <BrowserRouter>
            {!token ? (
              <Login setToken={setToken} />
            ) : (
              <div className="min-h-screen">
                <Routing />
              </div>
            )}
          </BrowserRouter>
        </AnimatePresence>
      </div>
    </div>
  );
}
