import { Stack } from 'expo-router';

const GameLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="join-game" />
      <Stack.Screen name="lobby" />
    </Stack>
  );
};

export default GameLayout;
