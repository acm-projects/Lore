import {
  View,
  Image,
  Text,
  ScrollView,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, { useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '~/components/Button';
import { router } from 'expo-router';
import { FaceIcon } from '@radix-ui/react-icons';
import { Asset } from 'expo-asset';

const Home = () => {
  const styles = require('../globalStyles');

  useEffect(() => {
    async function loadGifs() {
      await Asset.loadAsync(require('assets/bg2.gif'));
    }

    loadGifs();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 bg-background">
        <StatusBar />
        <Image
          className="h-full w-full"
          style={{ resizeMode: 'cover', position: 'absolute', opacity: 0.5 }}
          source={require('assets/Homebg.png')}
        />
        <View className="h-[150px] w-full items-center justify-between bg-backgroundSecondary pt-4">
          <Image
            source={require('assets/Logo 1.png')}
            style={[{ width: 300, height: 150 }, { resizeMode: 'contain' }]}></Image>
        </View>
        <ScrollView>
          <SafeAreaView>
            <Button
              title="Story"
              bgVariant="primary"
              onPress={() => {
                router.push('/(game)/(play)/end-screen');
              }}
            />
          </SafeAreaView>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Home;
