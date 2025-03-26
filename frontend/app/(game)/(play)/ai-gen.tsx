import { View, Text, Image, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import GameBar from '~/components/GameBar';
import Button from '~/components/Button';
import { useLobby } from '~/context/LobbyContext';
import { useLocalSearchParams } from 'expo-router';
import { socket } from '~/socket';

const AIGen = () => {
  const { lobbyCode, addPlotPoint } = useLobby();
  const { prompt, story: initialStory, round, lastRound } = useLocalSearchParams();
  const router = useRouter();

  const [story, setStory] = useState<string>(
    initialStory === 'Loading...' ? 'Loading...' : (initialStory as string)
  );
  const [continueCount, setContinueCount] = useState(0);
  const [totalPlayers, setTotalPlayers] = useState(1);
  const [hasPressedContinue, setHasPressedContinue] = useState(false);
  const [isLoading, setIsLoading] = useState(story === 'Loading...');

  const winnerAvatar = require('../../../assets/avatar1.png');

  const roundNumber = parseInt(round as string, 10);
  const lastRoundNumber = parseInt(lastRound as string, 10);
  const isFinalRound = roundNumber >= lastRoundNumber;

  useEffect(() => {
    socket.emit('request_continue_count', lobbyCode);

    socket.on('update_continue_count', ({ count, total }) => {
      setContinueCount(count);
      setTotalPlayers(total);
    });

    socket.on('go_to_prompt', () => {
      router.replace('/(game)/(play)/write');
    });

    socket.on('go_to_end', () => {
      router.replace('/(game)/(play)/summary');
    });

    socket.on('story_ready', ({ prompt: finalPrompt, story: finalStory }) => {
      console.log('✅ AI story received');
      setStory(finalStory);
      setIsLoading(false);
      console.log(finalPrompt, finalStory);
      addPlotPoint({ winningPlotPoint: finalPrompt, story: finalStory });
    });

    return () => {
      socket.off('update_continue_count');
      socket.off('go_to_prompt');
      socket.off('go_to_end');
      socket.off('story_ready');
    };
  }, [lobbyCode]);

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
        <View className="flex w-full flex-row rounded-lg bg-backgroundAccent p-4">
          <View className="h-10 w-10 overflow-hidden rounded-full border-2 border-white">
            <Image source={winnerAvatar} className="h-full w-full" resizeMode="cover" />
          </View>
          <View className="flex-1 px-3">
            <Text className="text-lg font-bold text-backgroundAccentText" numberOfLines={0}>
              {prompt}
            </Text>
          </View>
        </View>

        {/* 📖 Story Box or Loading Spinner */}
        <ScrollView
          className="w-full flex-1 rounded-bl-lg rounded-br-lg bg-gray-600 p-4"
          contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
          {isLoading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#ffffff" />
              <Text className="mt-4 text-lg text-white">Loading story...</Text>
            </View>
          ) : (
            <Text className="whitespace-pre-line text-center text-2xl font-bold text-backgroundText">
              {story}
            </Text>
          )}
        </ScrollView>

        {/* ✅ Continue Button */}
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
