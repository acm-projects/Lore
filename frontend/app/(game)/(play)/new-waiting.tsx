import { View, Text, Image } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import PlayerAvatarRow from '~/components/PlayerAvatarRow';

export type PlayersWaiting = {
  id: number;
  finished: boolean;
};

const NewWaiting = () => {
  const avatarData: PlayersWaiting[] = [
    { id: 1, finished: false },
    { id: 2, finished: false },
    { id: 3, finished: true },
    { id: 4, finished: false },
    // Add more avatars as needed
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex flex-1 items-center justify-center">
        <Image
          source={require('assets/waiting_animation.gif')}
          className="h-auto w-full"
          resizeMode="contain"
        />
      </View>
      <View className="absolute left-1/2 top-2/3 flex -translate-x-1/2 -translate-y-1/2">
        <PlayerAvatarRow
          players={avatarData}
          maxAvatarSize={50} // Maximum size of each avatar
          minAvatarSize={30} // Minimum size that avatars can shrink to
        />
      </View>
      <Image source={{ uri: 'https://avatar.iran.liara.run/public' }} resizeMode="contain" />
    </SafeAreaView>
  );
};

export default NewWaiting;
