import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import GameBar from '~/components/GameBar';
import Profile from '~/app/(main)/profile';
import ProfileDisplay from '~/components/ProfileDisplay';
import { router, useLocalSearchParams } from 'expo-router';

const PlayersWaiting = () => {
  const params = useLocalSearchParams();
  const timeRemaining = params.timeRemaining ? parseInt(params.timeRemaining as string) : 30;

  const onTimerEnd = () => {
    //For now redirect to voting
    router.replace('/(game)/(play)/voting');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <GameBar
        onComplete={onTimerEnd}
        duration={30}
        initialRemainingTime={timeRemaining}
        isAbsolute={false}
      />
      <ScrollView className="flex-1 px-5 py-10" contentContainerStyle={{ flexGrow: 1, gap: 10 }}>
        <ProfileDisplay username="John Doe" isVariant={true} />
        <ProfileDisplay username="Jane Doe" isVariant={false} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PlayersWaiting;
