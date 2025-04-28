import { View, Text, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import React, { useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OtpInput } from 'react-native-otp-entry';
import Button from '~/components/Button';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { socket } from '~/socket';
import { getUserAttributes } from '../(user_auth)/CognitoConfig';
import { Audio } from 'expo-av';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';

const JoinGame = () => {
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  useFonts({
    'JetBrainsMonoRegular': require('assets/fonts/JetBrainsMonoRegular.ttf'),
    'JetBrainsMonoBold': require('assets/fonts/JetBrainsMonoBold.ttf'),
  });

  //SFX
  const soundRef = useRef<Audio.Sound | null>(null);
  const clickSFX = async () => {
    const { sound } = await Audio. Sound.createAsync(
      require('assets/click.mp3'),
    );
    soundRef.current = sound;
    await sound.playAsync()
  }

  const joinGameWithCode = async () => {
    setErrorMessage(null); // Clear previous error

    let joinPayload: {
      room: string;
      username?: string;
      cognitoSub?: string | null;
      playerId?: number | null;
    } = {
      room: code,
      username: "Guest", // default fallback
      cognitoSub: null,
      playerId: null,
    };

    try {
      const user = await getUserAttributes();

      if (user?.displayName && user?.sub) {
        joinPayload.username = user.displayName;
        joinPayload.cognitoSub = user.sub;
      }
    } catch (err) {
      console.warn("⚠️ Not logged in, using guest ID if available");
    }

    try {
      const guestId = await AsyncStorage.getItem('playerId');
      if (guestId !== null) {
        joinPayload.playerId = parseInt(guestId);
      }
    } catch (err) {
      console.warn("⚠️ Failed to get playerId from AsyncStorage:", err);
    }

    socket.emit('join_room', joinPayload, (response: any) => {
      if (!response.success) {
        setErrorMessage(response.message); // Set error from backend
      } else {
        router.replace({
          pathname: '/(game)/lobby',
          params: { lobbyCode: code },
        });
      }
    });
  };

  const goBack = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex flex-1 items-center justify-center"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ArrowLeft color={'white'} style={{ position: 'absolute', top: 20, left: 20 }} onPress={goBack} />
        <View className="mx-8 w-full items-center">
          <Text style={{fontFamily: 'JetBrainsMonoBold'}}className="mb-6 text-center text-4xl font-bold text-backgroundText">
            Enter join code
          </Text>
          <OtpInput
            numberOfDigits={6}
            onTextChange={(text) => setCode(text)}
            theme={{ pinCodeTextStyle: { color: '#FFFFFF' } }}
          />
          {errorMessage && (
          <Text style={{fontFamily: 'JetBrainsMonoRegular'}} className="mt-4 text-center text-red-500 text-lg font-semibold">
            {errorMessage}
          </Text>
        )}
        <TouchableOpacity className="bg-primaryAccent w-[95%] h-[50px] justify-center items-center rounded-xl mt-4"
                                        onPress={() => {clickSFX(); joinGameWithCode()}}>
          <Text style={{fontFamily: 'JetBrainsMonoBold', color: "white"}}>Join Game</Text>
        </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default JoinGame;
