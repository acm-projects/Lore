import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Asset } from 'expo-asset';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native'

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
