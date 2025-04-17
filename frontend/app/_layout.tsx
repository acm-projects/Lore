import '../global.css';

import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(user_auth)" />
      <Stack.Screen name="(game)" />
      <Stack.Screen name="(main)" />
      <Stack.Screen name="(profiles)" />
    </Stack>
  );
}
