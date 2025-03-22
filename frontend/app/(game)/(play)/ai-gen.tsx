import { View, Text, Image, ScrollView, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import GameBar from '~/components/GameBar';
import Button from '~/components/Button';
import { useLobby } from '~/context/LobbyContext';
import { useLocalSearchParams } from 'expo-router';

const AIGen = () => {
  const { lobbyCode } = useLobby();
  const { prompt, story } = useLocalSearchParams();

  const winnerAvatar = require('../../../assets/avatar1.png');
  const winnerPlotPoint = 'The hero discovers a hidden treasure map';

  const AIText =
    "The villain reveals their master plan and the hero's true identity. He then steps back in fear waiting for death by a thousand cuts. This is not the end though, the villian continues to berate the hero. This nonstop flurry of insults baffles the hero.";

  return (
    <SafeAreaView className="max-h-full flex-1 bg-background">
      <Image className="w-full" style={{resizeMode: 'cover', position: 'absolute', height: Dimensions.get("window").height}} source={require("assets/bg4.gif")}/> 
      <GameBar isAbsolute={false} headerText="The Plot Thickens!" />
      <View className="mt-4 flex h-full flex-1 items-center justify-around px-6">
        {/* Plot Point Winner*/}
        <View className="flex w-full flex-row rounded-lg border-2 border-primary bg-backgroundAccent p-4">
          <View className="h-16 w-16 overflow-hidden rounded-full border-2 border-white">
            <Image source={winnerAvatar} className="h-full w-full" resizeMode="cover" />
          </View>
          <View className="flex-1 px-3">
            <Text className="text-lg font-bold text-backgroundAccentText" numberOfLines={0}>
              {prompt}
            </Text>
          </View>
        </View>

        {/* AI Text */}
        <ScrollView className="flex-1 rounded-bl-lg rounded-br-lg bg-gray-600 p-4">
          <Text className="mt-4 text-center text-2xl font-bold text-backgroundText">{story}</Text>
        </ScrollView>

        <View className="itmes-center mt-4 flex-[0.2] flex-row justify-center">
          {/*<View className="flex-1">
            <Image
              source={require('../../../assets/lore-guy.png')}
              className="h-full w-full"
              resizeMode="cover"
            />
          </View>*/}

          <View className="w-full flex-1">
            <Button title="Continue" bgVariant="primary" textVariant="primary" onPress={() => {}} />
            <Text className="mt-4 text-center text-2xl font-bold text-backgroundText">4/5</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AIGen;
