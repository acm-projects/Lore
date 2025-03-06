import { Stack } from 'expo-router';
import GameBar from '~/components/GameBar';

const PlayLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="write" />
    </Stack>
  );
};

export default PlayLayout;
