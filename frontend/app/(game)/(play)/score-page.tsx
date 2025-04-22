import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SafeAreaView, Text, ActivityIndicator, Image, Dimensions, View } from 'react-native';
import AnimatedScoreboard from '~/components/AnimatedScoreboard';
import { useLobby } from '~/context/LobbyContext';
import { socket } from '~/socket';
import { useFocusEffect, useRouter } from 'expo-router';
import { useAudio } from '~/context/AudioContext';
import { Audio } from 'expo-av';
import MuteButton from '~/components/MuteButton';
import { useFonts } from 'expo-font';

type ScoreData = {
  id: string;
  username: string;
  avatar_url: string;
  past_score: number;
  score_to_add: number;
  new_score: number;
  winner: boolean;
};

const ScorePage = () => {
  const { lobbyCode } = useLobby();
  const [sampleData, setSampleData] = useState<ScoreData[]>([]);
  const [prompt, setPrompt] = useState<string>('Loading...');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    scoreSFX()
    socket.on('score_summary', (data: ScoreData[]) => {
      setSampleData(data);
      setLoading(false);
    });

    socket.on('go_to_ai_gen', ({ prompt }) => {
      setPrompt(prompt);
      router.replace({
        pathname: '/(game)/(play)/ai-gen',
        params: {
          prompt,
          story: 'Loading...',
        },
      });
    });

    return () => {
      socket.off('score_summary');
      socket.off('go_to_ai_gen');
    };
  }, [lobbyCode]);

  const { playSound, stopSound, isMuted, toggleMute } = useAudio();
  const soundRef = useRef<Audio.Sound | null>(null);
  const scoreSFX = async () => {
    const { sound } = await Audio. Sound.createAsync(
      require('assets/score-sfx.mp3'),
    );
    soundRef.current = sound;
    await sound.playAsync()
  }

  useFocusEffect( // For music, starts playing when writing screen is active, stops when navigated away
    useCallback(() => {
      if(!isMuted){
        playSound(require('assets/score-track.mp3'));
      } 
      return() => {
        stopSound();
      }
    }, [isMuted]
  ))

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <Image source={require('assets/reading animation.gif')} className="h-32 w-32" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Image className="w-full" style={{ resizeMode: 'cover', position: 'absolute', height: Dimensions.get("window").height}} source={require("assets/bg9.gif")}/> 
      <Text className="mt-5 text-center text-3xl font-bold text-backgroundText"
            style={{fontFamily: 'JetBrainsMonoBold'}}>
        Leaderboard
      </Text>
      <AnimatedScoreboard data={sampleData} />
      <View className="w-full h-full justify-end items-end right-4 bottom-4" style={{position: 'absolute'}}>
          <MuteButton/>
      </View>
    </SafeAreaView>
  );
};

export default ScorePage;
