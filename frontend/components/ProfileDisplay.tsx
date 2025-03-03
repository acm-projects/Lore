import { View, Text } from 'react-native';
import React from 'react';

const ProfileDisplay = ({ username }: { username: string }) => {
  return (
    <View className="bg-backgroundAccent flex flex-row items-center justify-center gap-x-2 rounded-full px-4 py-2">
      <Text className="text-backgroundAccentText text-2xl font-bold">{username}</Text>
    </View>
  );
};

export default ProfileDisplay;
