import { View, Text, ScrollView, Image, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import GameBar from '~/components/GameBar';
import Profile from '~/app/(main)/profile';
import ProfileDisplay from '~/components/ProfileDisplay';
import { router, useLocalSearchParams } from 'expo-router';
import { useLobby } from '~/context/LobbyContext';
import { socket } from '~/socket';

const PlayersWaiting = () => {
  const params = useLocalSearchParams();
  const phase = params.phase;
  const { lobbyCode, addPlotPoint } = useLobby();
  const timeRemaining = params.timeRemaining ? parseInt(params.timeRemaining as string) : 30;

  const onTimerEnd = () => {
    //For now redirect to voting
    router.replace('/(game)/(play)/voting');
  };

  useEffect(() => {
    console.log(`🚀 Waiting Screen Loaded | Phase: ${phase}`);

    if (phase === 'prompts') {
      socket.on('prompts_ready', () => {
        console.log("✅ Received 'prompts_ready' event. Moving to vote screen.");
        router.replace('/(game)/(play)/voting');
      });
    } else if (phase === 'story') {
      socket.on('story_ready', ({ prompt, story, finalRound }) => {
        console.log("✅ Received 'story_ready' event. Moving to story screen.");

        addPlotPoint(story);

        router.replace({
          pathname: '/(game)/(play)/ai-gen',
          params: { prompt, story },
        });
      });
    }

    // Cleanup event listeners when unmounting or re-rendering
    return () => {
      console.log('🧹 Cleaning up event listeners');
      socket.off('prompts_ready');
      socket.off('story_ready');
    };
  }, [lobbyCode, phase]);

  return (
    <SafeAreaView className="flex-1 bg-background">
        <Image className="w-full" style={{resizeMode: 'cover', position: 'absolute', height: Dimensions.get("window").height}} source={require("assets/bg2.gif")}/> 
      
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
