import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, ActivityIndicator } from 'react-native';
import AnimatedScoreboard from '~/components/AnimatedScoreboard';
import { useLobby } from '~/context/LobbyContext';
import { socket } from '~/socket';
import { useRouter } from 'expo-router';

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
    socket.on('score_summary', (data: ScoreData[]) => {
      setSampleData(data);
      setLoading(false);
    });

    socket.on('go_to_ai_gen', ({ prompt }) => {
      setPrompt(prompt);
    });

    return () => {
      socket.off('score_summary');
      socket.off('go_to_ai_gen');
    };
  }, [lobbyCode]);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace({
        pathname: '/(game)/(play)/ai-gen',
        params: {
          prompt,
          story: 'Loading...',
        },
      });
    }, 6000);

    return () => clearTimeout(timer);
  }, [prompt]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Text className="mt-5 text-center text-3xl font-bold text-backgroundText">
        Leaderboard
      </Text>
      <AnimatedScoreboard data={sampleData} />
    </SafeAreaView>
  );
};

export default ScorePage;
