import React from "react";
import { Routes, Route } from "react-router-dom";
import { Host } from "./pages/host";
import { Menu } from "./pages/menu";
import { Player } from "./pages/player";

export function Routing() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Menu />} />
      </Routes>
      <Routes>
        <Route path="/player" element={<Player />} />
      </Routes>
      <Routes>
        <Route path="/host" element={<Host />} />
      </Routes>
    </>
  );
}
