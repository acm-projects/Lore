import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '~/components/Button';
import LeaderboardComponent, { Players } from '~/components/Leaderboard';
import { useLobby } from '~/context/LobbyContext';
import { router } from 'expo-router';

const EndScreen = () => {
  //As of right now the avatar does not work
  const players: Players[] = [
    { avatar: '', plotPoints: 1 },
    { avatar: '', plotPoints: 2 },
    { avatar: '', plotPoints: 4 },
  ];

  const { toggleVisible } = useLobby();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="mt-10" contentContainerStyle={{ flex: 1, alignItems: 'center' }}>
        <Text className="text-2xl font-bold text-backgroundText">
          And so the story comes to a close...
        </Text>
        <Button
          title="View the Full Story"
          onPress={() => {
            toggleVisible();
          }}
          className="mt-10 w-[80%]"
        />
        <Text className="mt-10 text-2xl font-bold text-backgroundText">
          Most Plot Points Chosen
        </Text>
        <LeaderboardComponent players={players} />
        <Button
          title="Home"
          onPress={() => {
            router.dismissTo('/(main)/home');
          }}
          className="mt-10 w-[80%]"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default EndScreen;
