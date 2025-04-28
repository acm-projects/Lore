import { View, Text, Image } from 'react-native';
import React from 'react';
import { useFonts } from 'expo-font';

const ProfileDisplay = ({
  
  username,
  avatar,
  isVariant = false,
}: {
  username: string;
  avatar?: string;
  isVariant?: boolean;
}) => {

  useFonts({
    'JetBrainsMonoRegular': require('assets/fonts/JetBrainsMonoRegular.ttf'),
    'JetBrainsMonoBold': require('assets/fonts/JetBrainsMonoBold.ttf'),
  });

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
      <Text  style={{fontFamily: 'JetBrainsMonoBold'}} className="text-2xl font-bold text-backgroundAccentText">{username}</Text>
    </View>
  );
};

export default ProfileDisplay;
