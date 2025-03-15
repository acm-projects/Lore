import { View, Text, ScrollView } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import GameBar from '~/components/GameBar';
import ProfileDisplay from '~/components/ProfileDisplay';
import { useRouter, useLocalSearchParams } from 'expo-router';  // ✅ Correct import
import { useLobby } from '~/context/LobbyContext';
import { socket } from '~/socket';

const PlayersWaiting = () => {
  const router = useRouter();  // ✅ Use router properly
  const params = useLocalSearchParams();
  const phase = params.phase;
  const { lobbyCode, addPlotPoint } = useLobby();
  const timeRemaining = params.timeRemaining ? parseInt(params.timeRemaining as string) : 30;
  const round = params.round ? parseInt(params.round as string) : 1;  // ✅ Extract round safely

  const onTimerEnd = () => {
    router.replace('/(game)/(play)/voting');  // ✅ Fixed router usage
  };

  useEffect(() => {
    console.log(`🚀 Waiting Screen Loaded | Phase: ${phase}`);

    if (phase === 'prompts') {
      socket.on('prompts_ready', () => {
        console.log("✅ Received 'prompts_ready' event. Moving to vote screen.");
        router.replace('/(game)/(play)/voting');
      });
    } else if (phase === 'story') {
      socket.on('story_ready', ({ prompt, story, round }) => {  // ✅ Extract round from event
        console.log(`✅ Received 'story_ready' event. Moving to story screen (Round: ${round}).`);

        addPlotPoint({ winningPlotPoint: prompt, story });

        router.replace({
          pathname: '/(game)/(play)/ai-gen',
          params: { 
            prompt, 
            story, 
            round: round.toString(),  // ✅ Ensure round is passed as a string
          },
        });
      });
    }

    return () => {
      console.log('🧹 Cleaning up event listeners');
      socket.off('prompts_ready');
      socket.off('story_ready');
    };
  }, [lobbyCode, phase]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <GameBar
        onComplete={onTimerEnd}
        duration={30}
        initialRemainingTime={timeRemaining}
        isAbsolute={false}
      />
      <ScrollView className="flex-1 px-5 py-10" contentContainerStyle={{ flexGrow: 1, gap: 10 }}>
        <ProfileDisplay username="John Doe" isVariant={true} />
        <ProfileDisplay username="Jane Doe" isVariant={false} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PlayersWaiting;
