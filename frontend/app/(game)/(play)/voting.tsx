import { View, Text, ScrollView } from 'react-native';
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

  /*const plotPoints = [
    {
      id: 1,
      //avatar: require('../../../assets/avatar1.png'),
      plotPoint: 'The hero discovers a hidden treasure map',
      votes: 2,
    },
    {
      id: 2,
      //avatar: require('../../../assets/avatar1.png'),
      plotPoint: 'The villain reveals their master plan',
      votes: 5,
    },
  ];*/

  useEffect(() => {
    console.log('📡 Requesting prompts for voting...');
    socket.emit('request_prompts', { room: lobbyCode });

    socket.on('receive_prompts', (receivedPrompts) => {
      if (!Array.isArray(receivedPrompts)) {
        console.error('❌ Invalid prompts received:', receivedPrompts);
        return;
      }
      console.log('✅ Prompts received:', receivedPrompts);
      setPrompts(receivedPrompts);
    });

    return () => {
      socket.off('receive_prompts');
    };
  }, [lobbyCode]);

  useEffect(() => {
    if (selectedId === -1) return;
    console.log(`🗳 Submitting vote for: "${prompts[selectedId]}"`);
    socket.emit('submit_vote', { room: lobbyCode, votedPrompt: prompts[selectedId].prompt });

    router.replace({
      pathname: '/(game)/(play)/players-waiting',
      params: { timeRemaining: timeRemaining, phase: 'story' },
    });
  }, [selectedId]);

  const onUpdate = (remainingTime: number) => {
    setTimeRemaining(remainingTime);
  };

  const onTimerEnd = () => {
    router.replace('/(game)/(play)/ai-gen');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
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
              //avatar={item.avatar}
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
