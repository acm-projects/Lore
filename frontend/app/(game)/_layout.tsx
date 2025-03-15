import { Stack } from 'expo-router';
import { LobbyProvider } from '~/context/LobbyContext';

const GameLayout = () => {
  return (
    <LobbyProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="join-game" />
        <Stack.Screen name="lobby" />
      </Stack>
    </LobbyProvider>
  );
};

export default GameLayout;
