import { View, Text, Image, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Asset } from 'expo-asset';
import { router } from 'expo-router';

const Index = () => {
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  // Load all images
  useEffect(() => {
    async function loadGifs() {
      await Asset.loadAsync(require('assets/bg1.gif'));
      await Asset.loadAsync(require('assets/bg2.gif'));
      await Asset.loadAsync(require('assets/bg3.gif'));
      await Asset.loadAsync(require('assets/bg4.gif'));
      await Asset.loadAsync(require('assets/bg5.gif'));
      setIsLoadingImages(false);
    }
    loadGifs();
  }, []);

  useEffect(() => {
    if (!isLoadingImages) {
      router.replace('/(user_auth)/sign-in');
    }
  }, [isLoadingImages]);

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-background">
      <Image source={require('assets/reading animation.gif')} className="h-32 w-32" />
    </SafeAreaView>
  );
};

export default Index;
