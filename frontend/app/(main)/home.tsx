import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Asset } from 'expo-asset';
import {  } from '../(user_auth)/CognitoConfig';
import Animated, { BounceInDown, Easing, useSharedValue, withSpring } from 'react-native-reanimated';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native'
import { useFocusEffect, useNavigation } from 'expo-router';

const Home = () => {
  
  useEffect(() => {
    async function loadGifs() {
      await Asset.loadAsync(require('assets/bg1.gif'));
      await Asset.loadAsync(require('assets/bg2.gif'));
      await Asset.loadAsync(require('assets/bg3.gif'));
      await Asset.loadAsync(require('assets/bg4.gif'));
      await Asset.loadAsync(require('assets/bg5.gif'));
      await Asset.loadAsync(require('assets/createStoryVector1.png'));
      await Asset.loadAsync(require('assets/createStoryVector2.png'));
      await Asset.loadAsync(require('assets/createStoryVector3.png'));
      await Asset.loadAsync(require('assets/createStoryVector4.png'));
      await Asset.loadAsync(require('assets/createStoryVector5.png'));
      await Asset.loadAsync(require('assets/createStoryVector6.png'));
    }
    loadGifs();

  }, []);

  return (
    <SafeAreaView className="flex-1 bg-backgroundSecondary">
      <View className="flex-1 bg-background">
        <StatusBar />
        <View className="h-[150px] w-full items-center justify-between bg-backgroundSecondary">
          <Image
            source={require('assets/Logo 1.png')}
            style={[{ width: 300, height: 150 }, { resizeMode: 'contain' }]}/>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;
