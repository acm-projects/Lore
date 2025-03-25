import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Asset } from 'expo-asset';
import { getUserAttributes } from '../(user_auth)/CognitoConfig';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native'

const Home = () => {
  
  const printUser = () => {
    getUserAttributes();
  }

  useEffect(() => {
    async function loadGifs() {
      await Asset.loadAsync(require('assets/bg1.gif'));
      await Asset.loadAsync(require('assets/bg2.gif'));
      await Asset.loadAsync(require('assets/bg3.gif'));
      await Asset.loadAsync(require('assets/bg4.gif'));
      await Asset.loadAsync(require('assets/bg5.gif'));
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
        <TouchableOpacity className="bg-primaryAccent w-[50px] h-[50px]" onPress={() => {printUser()}}>

        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};



export default Home;
