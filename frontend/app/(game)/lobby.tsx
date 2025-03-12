import { View, Text, ScrollView } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Button from '~/components/Button';
import ProfileDisplay from '~/components/ProfileDisplay';
import { useLobby } from '~/context/LobbyContext';

const Lobby = () => {
  const { lobbyCode } = useLocalSearchParams();
  const { setLobbyCode } = useLobby();

  useEffect(() => {
    if (lobbyCode) {
      setLobbyCode(lobbyCode as string);
    }
  }, [lobbyCode]);

  const startGame = () => {
    router.replace('/(game)/(play)/write');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="mt-10 self-center">
        <Text className="text-3xl font-bold text-backgroundText">Join Code:</Text>
        <View className="mt-2 rounded-full bg-primary px-4 py-2">
          <Text className="text-center text-2xl font-bold text-primaryText">{lobbyCode}</Text>
        </View>
      </View>
      <ScrollView className="flex-1 px-5 py-10">
        <ProfileDisplay username="John Doe" />
      </ScrollView>
      <View className="mx-2 mb-2 flex flex-row gap-x-3">
        <Button
          title="Edit Settings"
          bgVariant="secondary"
          textVariant="secondary"
          className="flex-1"
        />
        <Button
          title="Start Game"
          bgVariant="primary"
          textVariant="primary"
          className="flex-1"
          onPress={startGame}
        />
      </View>
    </SafeAreaView>
  );
};

export default Lobby;
