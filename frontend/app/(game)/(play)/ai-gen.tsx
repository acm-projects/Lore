import { View, Text, Image, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router'; // ✅ Import router
import GameBar from '~/components/GameBar';
import Button from '~/components/Button';
import { useLobby } from '~/context/LobbyContext';
import { useLocalSearchParams } from 'expo-router';
import { socket } from '~/socket';

const AIGen = () => {
  const { lobbyCode } = useLobby();
  const { prompt, story, round, lastRound } = useLocalSearchParams();
  const router = useRouter(); // ✅ Initialize router

  const [continueCount, setContinueCount] = useState(0);
  const [totalPlayers, setTotalPlayers] = useState(1);
  const [hasPressedContinue, setHasPressedContinue] = useState(false);
  const winnerAvatar = require('../../../assets/avatar1.png');

  // ✅ Convert round to a number
  const roundNumber = parseInt(round as string, 10);
  const lastRoundNumber = parseInt(lastRound as string, 10);
  const isFinalRound = roundNumber >= lastRoundNumber;


  useEffect(() => {
    // Listen for updated continue count
    socket.on('update_continue_count', ({ count, total }) => {
      setContinueCount(count);
      setTotalPlayers(total);
    });

    // Listen for global navigation to write.tsx
    socket.on('go_to_next', () => {
      console.log('🔄 Navigating back to write.tsx...'); // ✅ Debugging
      if (isFinalRound) {
        router.replace('/(game)/(play)/summary');
      } else {
        router.replace('/(game)/(play)/write');
      }      
    });

    // Request current player count when entering
    socket.emit('request_continue_count', lobbyCode);

    return () => {
      socket.off('update_continue_count');
      socket.off('go_to_prompt');
    };
  }, [lobbyCode]); // ✅ Removed `finalRound` from dependencies

  const handleContinue = () => {
    if (!hasPressedContinue) {
      setHasPressedContinue(true);
      socket.emit('continue_pressed', lobbyCode);
    }
  };

  return (
    <SafeAreaView className="max-h-full flex-1 bg-background">
      <GameBar isAbsolute={false} headerText="The Plot Thickens!" />
      <View className="mt-4 flex h-full flex-1 items-center justify-around px-6">
        {/* Plot Point Winner */}
        <View className="flex w-full flex-row rounded-lg border-2 border-primary bg-backgroundAccent p-4">
          <View className="h-10 w-10 overflow-hidden rounded-full border-2 border-white">
            <Image source={winnerAvatar} className="h-full w-full" resizeMode="cover" />
          </View>
          <View className="flex-1 px-3">
            <Text className="text-lg font-bold text-backgroundAccentText" numberOfLines={0}>
              {prompt}
            </Text>
          </View>
        </View>

        {/* AI Generated Story */}
        <ScrollView className="flex-1 rounded-bl-lg rounded-br-lg bg-gray-600 p-4">
          <Text className="text-center text-2xl font-bold text-backgroundText">{story}</Text>
        </ScrollView>

        <View className="mt-4 flex-[0.2] flex-row items-center justify-center">
          <View className="w-full flex-1">
            <Button
              title={`Continue (${continueCount}/${totalPlayers})`}
              bgVariant={hasPressedContinue ? 'secondary' : 'primary'}
              textVariant={hasPressedContinue ? 'secondary' : 'primary'}
              onPress={handleContinue}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AIGen;
