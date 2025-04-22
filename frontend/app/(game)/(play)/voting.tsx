import { View, Text, ScrollView, Dimensions, Image, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import GameBar from '~/components/GameBar';
import PlotPointButton from '~/components/PlotPointButton';
import { router, useFocusEffect } from 'expo-router';
import { useLobby } from '~/context/LobbyContext';
import { socket } from '~/socket';
import { useFonts } from 'expo-font';
import { Audio } from 'expo-av';
import { useAudio } from '~/context/AudioContext';
import MuteButton from '~/components/MuteButton';

const Voting = () => {

  const { playSound, stopSound, isMuted, toggleMute } = useAudio();
  const soundRef = useRef<Audio.Sound | null>(null);

  useFocusEffect( // For music, starts playing when writing screen is active, stops when navigated away
    useCallback(() => {
      if(!isMuted){
        playSound(require('assets/voting-track.mp3'));
      } 
      return() => {
        stopSound();
      }
    }, [isMuted]
  ))
  const clickSFX = async () => {
    const { sound } = await Audio. Sound.createAsync(
      require('assets/click.mp3'),
    );
    soundRef.current = sound;
    await sound.playAsync()
  }

  const { votingDuration } = useLobby();
  const [timeRemaining, setTimeRemaining] = useState(
    votingDuration.minutes * 60 + votingDuration.seconds
  );
  const [selectedId, setSelectedId] = useState(-1);
  const { lobbyCode } = useLobby();
  const [prompts, setPrompts] = useState<{ prompt: string; playerId: string; name?: string; avatar?: string }[]>([]);

  useEffect(() => {
    // Request prompts when screen loads
    console.log('📡 Requesting prompts...');
    socket.emit('request_prompts', { room: lobbyCode });

    socket.on('receive_prompts', (receivedPrompts) => {
      console.log('✅ Prompts received:', receivedPrompts);
      if (Array.isArray(receivedPrompts)) {
        setPrompts(
          receivedPrompts.map((p) => ({
            avatar: p.avatar,
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

  useFonts({
    'JetBrainsMonoRegular': require('assets/fonts/JetBrainsMonoRegular.ttf'),
    'JetBrainsMonoBold': require('assets/fonts/JetBrainsMonoBold.ttf'),
  });

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Image className="w-full" style={{ resizeMode: 'cover', position: 'absolute', height: Dimensions.get("window").height}} source={require("assets/bg3.gif")}/> 
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
              isSelected={selectedId === index}
              onPress={() => {clickSFX(); setSelectedId(index)}}
            />
          ))}
        </View>
        <View className="w-full h-full justify-end items-end" style={{position: 'absolute'}}>
            <MuteButton/>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Voting;
