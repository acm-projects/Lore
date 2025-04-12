import { View, Text } from 'react-native';
import React from 'react';
import { useFonts } from 'expo-font';

const ProfileDisplay = ({
  
  username,
  isVariant = false,
}: {
  username: string;
  isVariant?: boolean;
}) => {

  useFonts({
    'JetBrainsMonoRegular': require('assets/fonts/JetBrainsMonoRegular.ttf'),
    'JetBrainsMonoBold': require('assets/fonts/JetBrainsMonoBold.ttf'),
  });

  return (
    <View
      className={`flex flex-row items-center justify-center gap-x-2 rounded-full bg-backgroundAccent px-4 py-2 ${isVariant ? 'bg-primary' : ''}`}>
      <Text style={{fontFamily: 'JetBrainsMonoBold'}} className="text-2xl font-bold text-backgroundAccentText">{username}</Text>
    </View>
  );
};

export default ProfileDisplay;
