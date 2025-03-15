import { View, Text, TouchableOpacity, ScrollView, Image, Animated } from 'react-native';
import { router } from 'expo-router';
import React, { useState } from 'react';
import PlotPoint from '~/components/PlotPoint';
import components from '~/data/data.json';
import Button from '~/components/Button';
import { useLobby } from '~/context/LobbyContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const StoryView = () => {
  const { plotPoints } = useLobby();

  return (
    <SafeAreaView className="flex-1">
      <Image
        className="h-full w-full"
        style={{ resizeMode: 'cover', position: 'absolute' }}
        source={require('assets/bg2.gif')}
      />
      <View className="h-[100px] w-full items-center justify-center bg-background">
        <Button
          title="Go Back"
          bgVariant="primaryAccent"
          className="w-[80px]"
          onPress={() => {
            router.push('/(main)/home');
          }}></Button>
      </View>

      <ScrollView className="flex-1">
        <SafeAreaView>
          <View className="my-12 flex-col-reverse">
            {plotPoints.map((component, index) => (
              <PlotPoint
                key={index}
                count={index}
                image={'assets/avatar1.png'}
                text={component.winningPlotPoint}
                story={component.story}
              />
            ))}
          </View>
        </SafeAreaView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StoryView;
