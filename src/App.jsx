import { GameplayProvider } from "./contexts/GameplayProvider";
import { RoomProvider } from "./contexts/RoomProvider";
import { UserProvider } from "./contexts/UserProvider";
import AppRoutes from "./routes/AppRoutes";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <RoomProvider>
          <GameplayProvider>
            <AppRoutes />
          </GameplayProvider>
        </RoomProvider>
      </UserProvider>
    </BrowserRouter>
  );
}
export default App;