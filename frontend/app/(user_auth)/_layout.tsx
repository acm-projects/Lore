import { Stack } from 'expo-router';

const userAuthLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-in" />
    </Stack>
  );
};

export default userAuthLayout;
