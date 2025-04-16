import { View, Text, Image, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Asset } from 'expo-asset';
import { autoSignIn, debugCognitoStorage } from './(user_auth)/CognitoConfig';
import { router } from 'expo-router';

const Index = () => {
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isUserSignedIn, setIsUserSignedIn] = useState<boolean | null>(null);
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

  //Check for auth (timeout after 5 seconds)
  useEffect(() => {
    // Check for existing session on component mount
    const checkSession = async () => {
      try {
        console.log('Checking for existing session...');

        await debugCognitoStorage();

        const isSignedIn = await autoSignIn();

        if (isSignedIn) {
          // User has a valid session, redirect to main app
          setIsLoadingAuth(false);
          setIsUserSignedIn(true);
        } else {
          // No valid session, show login screen
          setIsLoadingAuth(false);
          setIsUserSignedIn(false);
        }
      } catch (error) {
        console.error('Session check error:', error);
        Alert.alert('Error', (error as Error).message || 'Something went wrong.');
        setIsLoadingAuth(false);
        setIsUserSignedIn(false);
      }
    };
    checkSession();
    setTimeout(() => {
      setIsLoadingAuth(false);
    }, 5000);
  }, []);

  useEffect(() => {
    if (isLoadingImages || isLoadingAuth || isUserSignedIn === null) {
      return;
    }
    if (isUserSignedIn === true && !isLoadingAuth && !isLoadingImages) {
      router.replace('/(main)/home');
    } else if (isUserSignedIn === false && !isLoadingAuth && !isLoadingImages) {
      router.replace('/(user_auth)/sign-in');
    }
  }, [isLoadingImages, isLoadingAuth, isUserSignedIn]);

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-background">
      <Image source={require('assets/reading animation.gif')} className="h-32 w-32" />
    </SafeAreaView>
  );
};

export default Index;
