import { View, Text, ScrollView, Image, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import GameBar from '~/components/GameBar';
import PlotPointButton from '~/components/PlotPointButton';
import { router } from 'expo-router';
import { useLobby } from '~/context/LobbyContext';
import { socket } from '~/socket';

const Voting = () => {
  const [timeRemaining, setTimeRemaining] = useState(10);
  const [selectedId, setSelectedId] = useState(-1);
  const { lobbyCode } = useLobby();
  const [prompts, setPrompts] = useState<{ prompt: string }[]>([]);

  useEffect(() => {
    // Request prompts when screen loads
    console.log('📡 Requesting prompts...');
    socket.emit('request_prompts', { room: lobbyCode });

    socket.on('receive_prompts', (receivedPrompts) => {
      console.log('✅ Prompts received:', receivedPrompts);
      if (Array.isArray(receivedPrompts)) {
        setPrompts(receivedPrompts);
      } else {
        console.warn('❌ Invalid prompts received');
      }
    });

    // Navigation handlers
    socket.on('go_to_waiting', ({ phase }) => {
      router.replace({
        pathname: '/(game)/(play)/new-waiting',
        params: { timeRemaining, phase },
      });
    });

    socket.on('go_to_ai_gen', ({ prompt }) => {
      router.replace({
        pathname: '/(game)/(play)/ai-gen',
        params: { prompt, story: 'Loading...' },
      });
    });

    return () => {
      socket.off('receive_prompts');
      socket.off('go_to_waiting');
      socket.off('go_to_ai_gen');
    };
  }, [lobbyCode, timeRemaining]);

  useEffect(() => {
    if (selectedId === -1) return;

    const selectedPrompt = prompts[selectedId];
    console.log(`🗳 Submitting vote for: "${selectedPrompt.prompt}"`);
    socket.emit('submit_vote', { room: lobbyCode, votedPrompt: selectedPrompt.prompt });
  }, [selectedId]);

  const onUpdate = (remainingTime: number) => {
    setTimeRemaining(remainingTime);
  };

  const onTimerEnd = () => {
    console.log('⏰ Voting timer ended. Forcing vote evaluation.');
    socket.emit('force_end_voting', lobbyCode);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Image
        className="w-full"
        style={{
          resizeMode: 'cover',
          position: 'absolute',
          height: Dimensions.get('window').height,
        }}
        source={require('assets/bg3.gif')}
      />

      <GameBar
        onComplete={onTimerEnd}
        duration={10}
        initialRemainingTime={10}
        isAbsolute={false}
        onUpdate={onUpdate}
      />
      <Text className="mt-6 text-center text-5xl font-bold text-backgroundText">Vote Now</Text>
      <Text className="mt-3 text-center text-3xl font-bold text-backgroundAccentText">
        Choose a Player’s Plot Point
      </Text>
      <ScrollView className="flex-1 px-5 py-10" contentContainerStyle={{ flexGrow: 1, gap: 10 }}>
        <View className="gap-3 p-4">
          {prompts.map((item, index) => (
            <PlotPointButton
              key={index}
              plotPoint={item.prompt}
              votes={1}
              isSelected={selectedId === index}
              onPress={() => setSelectedId(index)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Voting;
