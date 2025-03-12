import { View, Text, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import GameBar from '~/components/GameBar';
import PlotPointButton from '~/components/PlotPointButton';
import { router } from 'expo-router';

const Voting = () => {
  const [selectedId, setSelectedId] = useState(0);

  const plotPoints = [
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
  ];

  const onTimerEnd = () => {
    router.replace('/(game)/(play)/ai-gen');
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <GameBar onComplete={onTimerEnd} duration={10} initialRemainingTime={10} isAbsolute={false} />
      <Text className="mt-6 text-center text-5xl font-bold text-backgroundText">Vote Now</Text>
      <Text className="mt-3 text-center text-3xl font-bold text-backgroundAccentText">
        Choose a Player’s Plot Point
      </Text>
      <ScrollView className="flex-1 px-5 py-10" contentContainerStyle={{ flexGrow: 1, gap: 10 }}>
        <View className="gap-3 p-4">
          {plotPoints.map((item) => (
            <PlotPointButton
              key={item.id}
              //avatar={item.avatar}
              plotPoint={item.plotPoint}
              votes={item.votes}
              isSelected={selectedId === item.id}
              onPress={() => setSelectedId(item.id)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Voting;
