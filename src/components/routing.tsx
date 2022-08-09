import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Host } from "./pages/host";
import { Menu } from "./pages/menu";
import { Player } from "./pages/player";

export function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Menu />} />
      </Routes>
      <Routes>
        <Route
          path="/player-waiting"
          element={<Player gameStarted={false} />}
        />
      </Routes>
      <Routes>
        <Route path="/player" element={<Player gameStarted />} />
      </Routes>
      <Routes>
        <Route path="/host-waiting" element={<Host gameStarted={false} />} />
      </Routes>
      <Routes>
        <Route path="/host" element={<Host gameStarted />} />
      </Routes>
    </BrowserRouter>
  );
}
