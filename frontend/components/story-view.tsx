import { View, Text, ScrollView, SafeAreaView, Image, Animated, Easing } from 'react-native';
import { router } from 'expo-router';
import React, { useRef, useEffect } from 'react';
import PlotPoint from '~/components/PlotPoint';
import components from '~/data/data.json';
import { BookOpen, Undo2, ChevronDown } from 'lucide-react-native';
import { useLobby } from '~/context/LobbyContext';

const StoryView = (props: { code: String }) => {
  const bounceValue = useRef(new Animated.Value(0)).current;
  const { plotPoints } = useLobby();

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceValue, {
          toValue: 5,
          duration: 650,
          easing: Easing.ease,
          useNativeDriver: true,
        }),

        Animated.timing(bounceValue, {
          toValue: 0,
          duration: 650,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [bounceValue]);

  return (
    <View className="flex-1">
      <Image
        className="h-full w-full"
        style={{ resizeMode: 'cover', position: 'absolute' }}
        source={require('assets/bg2.gif')}
      />

      <ScrollView className="flex-1">
        <SafeAreaView>
          <Animated.View
            style={{ transform: [{ translateY: bounceValue }] }}
            className="flex flex-row pb-2 pl-10 pt-12">
            <ChevronDown color="white" />
            <Text className="color-white"> Latest Plot Point </Text>
          </Animated.View>
          <View className="mb-12 flex-col-reverse">
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
    </View>
  );
};

export default StoryView;
