import { GameProvider } from "./contexts/GameContext";
import AppRoutes from "./routes/AppRoutes";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <GameProvider>
        <AppRoutes />
      </GameProvider>
    </BrowserRouter>
  );
}
export default App;