import { Stack } from 'expo-router';

const GameLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="join-game" />
    </Stack>
  );
};

export default GameLayout;
