import { Route, Routes, Navigate } from "react-router-dom";
import Layout from "../pages/Layout";
import TetrisPage from "../pages/TetrisPage";
import LoginPage from "../pages/LoginPage";
import LobbyPage from "../pages/LobbyPage";
import { RequireAuth, PublicOnlyRoute, GameGuard, LobbyGuard } from "../components/RouteGuards";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route element={<PublicOnlyRoute />}>
            <Route path="/" element={<LoginPage />} />
        </Route>
        <Route element={<RequireAuth />}>
            <Route element={<LobbyGuard />}>
                <Route path="/lobby" element={<LobbyPage />} />
            </Route>

            <Route element={<GameGuard />}>
                <Route path="/tetris" element={<TetrisPage />} />
            </Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;