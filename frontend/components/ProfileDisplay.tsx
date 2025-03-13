import { View, Text } from 'react-native';
import React from 'react';

const ProfileDisplay = ({
  username,
  isVariant = false,
}: {
  username: string;
  isVariant?: boolean;
}) => {
  return (
    <View
      className={`flex flex-row items-center justify-center gap-x-2 rounded-full bg-backgroundAccent px-4 py-2 ${isVariant ? 'bg-primary' : ''}`}>
      <Text className="text-2xl font-bold text-backgroundAccentText">{username}</Text>
    </View>
  );
};

export default ProfileDisplay;
