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
  
    try {
      const user = await getUserAttributes();
      console.log("🔐 Username:", user.displayName);
  
      socket.emit('join_room', { room: code, username: user.displayName, cognitoSub: user.sub }, (response: any) => {
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
