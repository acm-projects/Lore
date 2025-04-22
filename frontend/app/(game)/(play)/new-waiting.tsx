import { View, Text, Image, ScrollView, Dimensions } from 'react-native';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useLobby } from '~/context/LobbyContext';
import { socket } from '~/socket';
import PlayerAvatarRow from '~/components/PlayerAvatarRow';
import GameBar from '~/components/GameBar';
import { useAudio } from '~/context/AudioContext';
import MuteButton from '~/components/MuteButton';
import { Audio } from 'expo-av';

export type PlayersWaiting = {
  id: number | string;
  //currentScreen?: string;
  finished: boolean;
  avatar_url?: string;
  name: string;
};

const NewWaiting = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const phase = params.phase;
  const { lobbyCode, addPlotPoint } = useLobby();
  const timeRemaining = params.timeRemaining ? parseInt(params.timeRemaining as string) : 30;
  const round = params.round ? parseInt(params.round as string) : 1;
  const [players, setPlayers] = useState<PlayersWaiting[]>([]);

  useEffect(() => {
    console.log(`🚀 Waiting Screen Loaded | Phase: ${phase}`);

    // ✅ Notify server that the player is now in "players-waiting"
    socket.emit('update_screen', { room: lobbyCode, screen: 'players-waiting' });

    // ✅ Listen for user updates
    socket.on('update_users', (updatedUsers) => {
      console.log('👥 Updated Players List:', updatedUsers);

      // Transform the user data to match the PlayersWaiting type
      const transformedUsers = updatedUsers.map((user) => ({
        id: user.id,
        finished: user.currentScreen !== 'players-waiting', // Consider as finished if not in waiting screen
        //currentScreen: user.currentScreen || 'unknown',
        avatar_url: user.avatar,
        name: user.name,
      }));

      setPlayers(transformedUsers);
    });

    if (phase === 'prompts') {
      socket.on('prompts_ready', () => {
        console.log("✅ Received 'prompts_ready' event. Moving to vote screen.");
        router.replace('/(game)/(play)/voting');
      });
    } else if (phase === 'story') {
      socket.on('go_score', () => {
        console.log('🏁 go_score received — navigating to score-page');
        router.replace('/(game)/(play)/score-page');
      });

      // 👇 Optional: Handle early go_to_ai_gen if needed
      socket.on('go_to_ai_gen', ({ prompt }) => {
        router.replace({
          pathname: '/(game)/(play)/ai-gen',
          params: {
            prompt,
            story: 'Loading...',
          },
        });
      });
    }

    return () => {
      console.log('🚪 Leaving Waiting Screen, updating server...');
      socket.emit('update_screen', { room: lobbyCode, screen: 'unknown' });
      console.log('🧹 Cleaning up event listeners');
      socket.off('update_users');
      socket.off('prompts_ready');
      socket.off('story_ready');
      socket.off('go_to_ai_gen');
    };
  }, [lobbyCode, phase]);

  //SFX
  const { playSound, stopSound, isMuted, toggleMute } = useAudio();
  const soundRef = useRef<Audio.Sound | null>(null);
  const isMounted = useRef(true);
  
  useFocusEffect( // For music, starts playing when writing screen is active, stops when navigated away
    useCallback(() => {
      if(!isMuted){
        setTimeout(() => {
          //playSound(require('assets/waiting-track.mp3'));
        }, 500)
      } 
      return() => {
        isMounted.current = false;
        stopSound();
      }
    }, [isMuted]
  ))

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Image className="w-full" style={{ resizeMode: 'cover', position: 'absolute', height: Dimensions.get("window").height}} source={require("assets/bg8.gif")}/> 
      <GameBar
        onComplete={() => router.replace('/(game)/(play)/voting')}
        duration={30}
        initialRemainingTime={timeRemaining}
        isAbsolute={false}
      />     
      <View className="w-full h-1/2" style={{ marginTop: Dimensions.get("screen").height-100, position: 'absolute', backgroundColor: '#d9d9d9'}}/>
      <View className="flex flex-1 items-center justify-end">
        <Image
          source={require('assets/waiting-animation.gif')}
          className="h-auto w-full"
          resizeMode="contain"
          />
      </View>
      <View className="absolute left-1/2 top-2/3 flex -translate-x-1/2 -translate-y-1/2">
        <PlayerAvatarRow players={players} maxAvatarSize={50} minAvatarSize={30} />
      </View>
      <View className="w-full h-full justify-end items-end right-4 bottom-4" style={{position: 'absolute'}}>
          <MuteButton/>
      </View>
    </SafeAreaView>
  );
};

export default NewWaiting;
