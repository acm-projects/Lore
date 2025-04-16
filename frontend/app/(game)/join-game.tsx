import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OtpInput } from 'react-native-otp-entry';
import Button from '~/components/Button';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { socket } from '~/socket';
import { getUserAttributes } from '../(user_auth)/CognitoConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const JoinGame = () => {
  const [code, setCode] = useState('');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const joinGameWithCode = async () => {
    setErrorMessage(null); // Clear previous error
  
    try {
      const user = await getUserAttributes(); // from CognitoConfig
      let playerId = null;
      
      try {
        playerId = await AsyncStorage.getItem('playerId');
      } catch (err) {
        console.warn('⚠️ Failed to fetch playerId from AsyncStorage:', err);
      }
      
      // Build payload
      const joinPayload = {
        room: code,
        cognitoSub: user.sub, // always include this
      };
      
      if (playerId) {
        joinPayload.playerId = playerId; // only include if available
      }
      
      socket.emit('join_room', joinPayload, (response: any) => {
        if (!response.success) {
          setErrorMessage(response.message); // Set error message from backend
        } else {
          router.replace({
            pathname: '/(game)/lobby',
            params: {
              lobbyCode: code,
            },
          });
        }
      });
    } catch (err) {
      console.error("❌ Failed to get user attributes:", err);
      setErrorMessage("Authentication error.");
    }
  };


  const goBack = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex flex-1 items-center justify-center"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ArrowLeft style={{ position: 'absolute', top: 50, left: 20 }} onPress={goBack} />
        <View className="mx-5">
          <Text className="mb-6 text-center text-4xl font-bold text-backgroundText">
            Enter join code
          </Text>
          <OtpInput
            numberOfDigits={6}
            onTextChange={(text) => setCode(text)}
            theme={{ pinCodeTextStyle: { color: '#FFFFFF' } }}
          />
          {errorMessage && (
          <Text className="mt-4 text-center text-red-500 text-lg font-semibold">
            {errorMessage}
          </Text>
        )}
          <Button
            title="Join Game"
            bgVariant="primary"
            className="mt-6"
            onPress={joinGameWithCode}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default JoinGame;
