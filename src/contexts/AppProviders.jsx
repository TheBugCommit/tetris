import { GameplayProvider } from "./GameplayProvider";
import { RoomProvider } from "./RoomProvider";
import { UserProvider } from "./UserProvider";

const AppProviders = ({ children }) => (
  <UserProvider>
    <RoomProvider>
      <GameplayProvider>
         {children}
      </GameplayProvider>
    </RoomProvider>
  </UserProvider>
);

export default AppProviders