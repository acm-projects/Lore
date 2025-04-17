import { Stack } from 'expo-router';

const profilesLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="editing" />
    </Stack>
  );
};

export default profilesLayout;
