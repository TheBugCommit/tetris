import { Route, Routes, Navigate } from "react-router-dom"
import Login from "../pages/Login";
import Lobby from "../pages/Lobby";
import RequireName from "../components/RequireName";
import Layout from "../pages/Layout";
import GameRoom from "../pages/GameRoom";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Login />} />
        <Route element={<RequireName />}>
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/game" element={<GameRoom />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;