import { Stack } from 'expo-router';
import GameBar from '~/components/GameBar';
import { LobbyProvider } from '~/context/LobbyContext';

const PlayLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="write" />
      <Stack.Screen name="players-waiting" />
      <Stack.Screen name="voting" />
      <Stack.Screen name="ai-gen" />
    </Stack>
  );
};

export default PlayLayout;
