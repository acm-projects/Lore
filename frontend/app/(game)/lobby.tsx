import { View, Text, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Button from '~/components/Button';
import ProfileDisplay from '~/components/ProfileDisplay';
import { useLobby } from '~/context/LobbyContext';
import { socket } from '~/socket';

const Lobby = () => {
  const { lobbyCode } = useLocalSearchParams();
  const { setLobbyCode, players, setPlayers, setCreator } = useLobby();
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    if (lobbyCode) {
      setLobbyCode(lobbyCode as string);
    } else {
      console.log('No lobby code found');
      router.replace('/');
    }

    // Join the room and receive creatorId from the server
    socket.emit('join_room', { room: lobbyCode }, (response: any) => {
      if (!response.success) {
        console.error('❌ Failed to join room:', response.message);
        router.replace('/');
      } else {
        setCreator(response.creatorId); // Save creatorId from the server
        setIsCreator(response.creatorId === socket.id);
      }
    });

    socket.on('update_users', (users) => {
      console.log('👥 Updated Users List:', users);
      setPlayers(users || []);
    });

    socket.on('game_started', () => {
      console.log('🎮 Game Started! Navigating to prompt.tsx');
      router.replace('/(game)/(play)/write');
    });

    return () => {
      socket.off('update_users');
      socket.off('game_started');
    };
  }, [lobbyCode]);

  const startGame = () => {
    socket.emit('start_game', lobbyCode);
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
        {players.length > 0 ? (
          players.map((player, index) => (
            <ProfileDisplay key={index} username={player.id.substring(0, 6)} />
          ))
        ) : (
          <Text className="text-center text-backgroundText">Waiting for players...</Text>
        )}
      </ScrollView>
      {isCreator && (
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
      )}
    </SafeAreaView>
  );
};

export default Lobby;
