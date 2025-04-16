import { View, Text, ScrollView, SafeAreaView, Image, Animated, Easing, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useRef, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react-native';
import PlotPoint from '~/components/PlotPoint';

type PlotPointType = {
  winningPlotPoint: string;
  story: string;
  winner?: {
    username: string;
    avatar: string;
  } | null;
};

const StoryView = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const title = params.title as string;
  const plotPoints = JSON.parse(params.plotPoints as string) as PlotPointType[];

  const bounceValue = useRef(new Animated.Value(0)).current;

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
    <SafeAreaView className="flex-1">
      <View className="flex-1">
        {/* ✅ Fullscreen Background Image */}
        <Image
          source={require('assets/bg2.gif')}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            resizeMode: 'cover',
            zIndex: -1,
          }}
        />


        {/* Back button */}
        <TouchableOpacity
          className="absolute left-4 top-4 z-10"
          onPress={() => router.back()}
        >
          <ArrowLeft size={28} color="white" />
        </TouchableOpacity>

        <ScrollView className="flex-1">
          <SafeAreaView>
            <Text className="mt-20 mb-2 text-center text-3xl font-bold text-white">
              {title}
            </Text>
            <View className="mb-12 flex-col-reverse items-center">
              {plotPoints.map((point, index) => (
                <PlotPoint
                  key={index}
                  count={index}
                  image={point.winner?.avatar || 'assets/avatar1.png'}
                  username={point.winner?.username || 'Anonymous'}
                  text={point.winningPlotPoint}
                  story={point.story}
                />
              ))}
            </View>
          </SafeAreaView>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default StoryView;
