import { Route, Routes, Navigate } from "react-router-dom"
import RequireName from "../components/RequireName";
import Layout from "../pages/Layout";
import TetrisPage from "../pages/TetrisPage";
import LoginPage from "../pages/LoginPage";
import LobbyPage from "../pages/LobbyPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LoginPage />} />
        <Route element={<RequireName />}>
          <Route path="/lobby" element={<LobbyPage />} />
          <Route path="/tetris" element={<TetrisPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;