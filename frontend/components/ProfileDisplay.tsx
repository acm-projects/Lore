import { View, Text, Image } from 'react-native';
import React from 'react';

const ProfileDisplay = ({
  username,
  avatar,
  isVariant = false,
}: {
  username: string;
  avatar?: string;
  isVariant?: boolean;
}) => {
  return (
    <View
      className={`flex flex-row items-center gap-x-2 rounded-full bg-backgroundAccent px-4 py-2 ${
        isVariant ? 'bg-primary' : ''
      }`}
    >
      {avatar ? (
        <Image
          source={{ uri: avatar }}
          className="w-10 h-10 rounded-full"
        />
      ) : (
        <View className="w-10 h-10 rounded-full bg-gray-300" />
      )}
      <Text className="text-2xl font-bold text-backgroundAccentText">{username}</Text>
    </View>
  );
};

export default ProfileDisplay;
