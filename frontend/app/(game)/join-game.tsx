import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OtpInput } from 'react-native-otp-entry';
import Button from '~/components/Button';
import { ArrowLeft } from 'lucide-react-native';

const JoinGame = () => {
  return (
    <SafeAreaView className="bg-background flex-1">
      <KeyboardAvoidingView
        className="flex flex-1 items-center justify-center"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View className="mx-5">
          <Text className="text-backgroundText mb-6 text-center text-4xl font-bold">
            Enter join code
          </Text>
          <OtpInput
            numberOfDigits={6}
            onTextChange={(text) => console.log(text)}
            theme={{ pinCodeTextStyle: { color: '#FFFFFF' } }}
          />
          <Button title="Join Game" bgVariant="primary" className="mt-6" />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default JoinGame;
