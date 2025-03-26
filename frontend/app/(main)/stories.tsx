import { View, Text, Alert } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '~/components/Button';
import { router } from 'expo-router';
import { socket } from '~/socket';

const Stories = () => {
  const createGameRoom = () => {
    socket.emit('create_room', (response: any) => {
      if (response.success) {
        router.push(`/(game)/lobby?lobbyCode=${response.roomCode}`);
      } else {
        Alert.alert('Error', 'Failed to create room. Try again.');
      }
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="mx-3 flex flex-1 justify-between">
        <Text className="text-2xl font-bold text-backgroundText">Story History</Text>
        <View className="flex w-full flex-row gap-x-3">
          <Button
            title="Create Story"
            bgVariant="secondary"
            textVariant="secondary"
            className="flex-1"
            onPress={createGameRoom}
          />
          <Button
            title="Join Story"
            bgVariant="primary"
            textVariant="primary"
            className="flex-1"
            onPress={() => {
              router.push('/(game)/join-game');
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Stories;
