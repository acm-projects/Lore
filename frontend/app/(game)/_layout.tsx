import { Stack } from 'expo-router';
import { LobbyProvider } from '~/context/LobbyContext';
import { AudioProvider } from '~/context/AudioContext';

const GameLayout = () => {
  return (
    <LobbyProvider>
      <AudioProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="join-game" />
        <Stack.Screen name="lobby" />
        <Stack.Screen name="settings"/>
      </Stack>
      </AudioProvider>
    </LobbyProvider>
  );
};

export default GameLayout;
