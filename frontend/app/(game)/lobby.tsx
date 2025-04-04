import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Button from '~/components/Button';
import ProfileDisplay from '~/components/ProfileDisplay';
import { useLobby } from '~/context/LobbyContext';
import { socket } from '~/socket';
import * as Clipboard from 'expo-clipboard';

const Lobby = () => {
  const { lobbyCode } = useLocalSearchParams();
  const { setLobbyCode, players, setPlayers, setCreator } = useLobby();
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    if (!lobbyCode) {
      console.log('No lobby code found');
      router.replace('/');
      return;
    }
  
    setLobbyCode(lobbyCode as string);
  
    const joinAfterConnect = () => {
      console.log("✅ Connected with ID:", socket.id);
  
      socket.emit('join_room', { room: lobbyCode }, (response: any) => {
        console.log("🏠 Room Creator ID:", response.creatorId);
  
        if (!response.success) {
          console.error('❌ Failed to join room:', response.message);
          router.replace('/');
        } else {
          setCreator(response.creatorId);
          setIsCreator(response.creatorId === socket.id);
          console.log("🧠 Is Creator?", response.creatorId === socket.id);
        }
      });
    };
  
    if (socket.connected) {
      joinAfterConnect();
    } else {
      socket.once("connect", joinAfterConnect);
    }
  
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
      socket.off('connect', joinAfterConnect);
    };
  }, [lobbyCode]);
  

  const startGame = () => {
    socket.emit('start_game', lobbyCode);
  };

  const onCodePress = async () => {
    await Clipboard.setStringAsync(lobbyCode.toString());
    Alert.alert('Copied!', 'Lobby code copied to clipboard.');
  };

  const onEditSettingsPress = () => {
    router.push('/(game)/settings');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="mt-10 self-center">
        <Text className="text-3xl font-bold text-backgroundText">Join Code:</Text>
        <TouchableOpacity className="mt-2 rounded-full bg-primary px-4 py-2" onPress={onCodePress}>
          <Text className="text-center text-2xl font-bold text-primaryText">{lobbyCode}</Text>
        </TouchableOpacity>
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
          onPress={onEditSettingsPress}
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
