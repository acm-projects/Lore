import { View, Text } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimatedScoreboard from '~/components/AnimatedScoreboard';

export type UserScore = {
  username: string;
  avatar_url: string;
  past_score: number;
  score_to_add: number;
  new_score: number;
  winner: boolean;
};

const ScorePage = () => {
  const [sampleData, setSampleData] = useState([
    {
      username: 'Player1',
      avatar_url: 'https://avatar.iran.liara.run/public',
      past_score: 1200,
      score_to_add: 300,
      new_score: 1500,
      winner: false,
    },
    {
      username: 'Player2',
      avatar_url: 'https://avatar.iran.liara.run/public',
      past_score: 1400,
      score_to_add: 50,
      new_score: 1450,
      winner: false,
    },
    {
      username: 'Player3',
      avatar_url: 'https://avatar.iran.liara.run/public',
      past_score: 900,
      score_to_add: 500,
      new_score: 1400,
      winner: true,
    },
    {
      username: 'Player4',
      avatar_url: 'https://avatar.iran.liara.run/public',
      past_score: 800,
      score_to_add: 200,
      new_score: 1000,
      winner: false,
    },
    {
      username: 'Player5',
      avatar_url: 'https://avatar.iran.liara.run/public',
      past_score: 1100,
      score_to_add: 100,
      new_score: 1200,
      winner: false,
    },
  ]);
  return (
    <SafeAreaView className="flex-1 bg-background">
      <Text className="mt-5 text-center text-3xl font-bold text-backgroundText">Leaderboard</Text>
      <AnimatedScoreboard data={sampleData} />
    </SafeAreaView>
  );
};

export default ScorePage;
