import { View, Text, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OtpInput } from 'react-native-otp-entry';
import Button from '~/components/Button';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { socket } from '../(main)/socket'; // Import WebSocket connection

const JoinGame = () => {
  const [code, setCode] = useState('');

  const joinGameWithCode = () => {
    if (code.length !== 6) {
      Alert.alert("Invalid Code", "Please enter a 6-digit game code.");
      return;
    }

    socket.emit("join_room", { room: code }, (response: { success: boolean; message?: string }) => {
      if (response.success) {
        router.replace({
          pathname: '/(game)/lobby',
          params: { lobbyCode: code },
        });
      } else {
        Alert.alert("Error", response.message || "Failed to join the game.");
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
        <ArrowLeft style={{ position: 'absolute', top: 50, left: 20 }} onPress={goBack} />
        <View className="mx-5">
          <Text className="mb-6 text-center text-4xl font-bold text-backgroundText">
            Enter Join Code
          </Text>
          <OtpInput
            numberOfDigits={6}
            onTextChange={(text) => setCode(text)}
            theme={{ pinCodeTextStyle: { color: '#FFFFFF' } }}
          />
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
