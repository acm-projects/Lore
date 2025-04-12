import { View, Text, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import GameBar from '~/components/GameBar';
import PlotPointButton from '~/components/PlotPointButton';
import { router } from 'expo-router';
import { useLobby } from '~/context/LobbyContext';
import { socket } from '~/socket';
import { useFonts } from 'expo-font';

const Voting = () => {
  const { votingDuration } = useLobby();
  const [timeRemaining, setTimeRemaining] = useState(
    votingDuration.minutes * 60 + votingDuration.seconds
  );
  const [selectedId, setSelectedId] = useState(-1);
  const { lobbyCode } = useLobby();
  const [prompts, setPrompts] = useState<{ prompt: string; playerId: string; name?: string }[]>([]);

  useEffect(() => {
    // Request prompts when screen loads
    console.log('📡 Requesting prompts...');
    socket.emit('request_prompts', { room: lobbyCode });

    socket.on('receive_prompts', (receivedPrompts) => {
      console.log('✅ Prompts received:', receivedPrompts);
      if (Array.isArray(receivedPrompts)) {
        setPrompts(
          receivedPrompts.map((p) => ({
            prompt: p.prompt,
            playerId: p.playerId,
            name: p.name || p.playerId?.substring(0, 6) || 'Unknown',
          }))
        );
      } else {
        console.warn('❌ Invalid prompts received');
      }
    });

    // Navigation handlers
    socket.on('go_to_waiting', ({ phase }) => {
      router.replace({
        pathname: '/(game)/(play)/players-waiting',
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

  useFonts({
    'JetBrainsMonoRegular': require('assets/fonts/JetBrainsMonoRegular.ttf'),
    'JetBrainsMonoBold': require('assets/fonts/JetBrainsMonoBold.ttf'),
  });

  return (
    <SafeAreaView className="flex-1 bg-background">
      <GameBar
        onComplete={onTimerEnd}
        duration={votingDuration.minutes * 60 + votingDuration.seconds}
        initialRemainingTime={votingDuration.minutes * 60 + votingDuration.seconds}
        isAbsolute={false}
        onUpdate={onUpdate}
      />
      <Text style={{fontFamily: 'JetBrainsMonoBold'}} className="mt-6 text-center text-5xl font-bold text-backgroundText">Vote Now</Text>
      <Text style={{fontFamily: 'JetBrainsMonoRegular'}} numberOfLines={1} adjustsFontSizeToFit={true} className="mt-3 mx-3 text-center text-3xl font-bold text-backgroundAccentText">
        Choose a Player’s Plot Point
      </Text>
      <ScrollView className="flex-1 px-5 py-10" contentContainerStyle={{ flexGrow: 1, gap: 10 }}>
        <View className="gap-3 p-4">
          {prompts.map((item, index) => (
            <PlotPointButton
              key={index}
              plotPoint={item.prompt}
              //username={item.name}
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
