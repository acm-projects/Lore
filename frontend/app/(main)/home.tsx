import React, { useEffect, useRef, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import data from '~/data/data.json'
import Button from '~/components/Button';
import { router } from 'expo-router';
import { Asset } from 'expo-asset';
import {
  View,
  Image,
  Text,
  ScrollView,
  StatusBar,
  Animated,
  useAnimatedValue,
  Dimensions,
  Easing,
  TouchableOpacity,
  FlatList,
} from 'react-native'

const DATA = data;
type storyCardProps = {count: any, text: string, story: string}

const Home = () => {
    
  useEffect(() => {
    async function loadGifs() {
      await Asset.loadAsync(require('assets/bg2.gif'));
    }

    loadGifs();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-backgroundSecondary">
      <View className="flex-1 bg-background">
        <StatusBar />
        <Image
          className="h-full w-full"
          style={{ resizeMode: 'cover', position: 'absolute', opacity: 0.5 }}
          source={require('assets/Homebg.png')}
          />
        <View className="h-[150px] w-full items-center justify-between bg-backgroundSecondary">
          <Image
            source={require('assets/Logo 1.png')}
            style={[{ width: 300, height: 150 }, { resizeMode: 'contain' }]}></Image>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;
