import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Asset } from 'expo-asset';
import {} from '../(user_auth)/CognitoConfig';
import Slider from '@react-native-community/slider';
import { View, Image, Text, TouchableOpacity, StatusBar } from 'react-native';
import LuckyWheel from '~/components/LuckyWheel';
import Button from '~/components/Button';

const Home = () => {
  const [isWheelVisible, setIsWheelVisible] = useState(false);
  const [spins, setSpins] = useState(0);

  useEffect(() => {
    async function loadGifs() {
      await Asset.loadAsync(require('assets/bg2.gif'));
    }

    loadGifs();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-backgroundSecondary">
      <View className="flex-1 bg-background">
        <Image source={require('assets/waiting_animation.gif')} className="w-full" />
        <Button title="Bring Wheel On Screen" onPress={() => setIsWheelVisible(!isWheelVisible)} />
        <Button title="Spin" onPress={() => setSpins(spins + 1)} />
        <LuckyWheel
          items={['Prize 1', 'Prize 2', 'Prize 3', 'Prize 4', 'Prize 5', 'Prize 6']}
          winner="Prize 2"
          onSpinComplete={(result) => console.log('Winner:', result)}
          isVisible={isWheelVisible}
          spins={spins}
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;
