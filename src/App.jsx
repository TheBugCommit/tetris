import GameLoader from "./components/GameLoader";
import AppProviders from "./contexts/AppProviders";
import AppRoutes from "./routes/AppRoutes";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <GameLoader>
          <AppRoutes />
        </GameLoader>
      </AppProviders>
    </BrowserRouter>
  );
}
export default App;