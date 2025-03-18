import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputField from '~/components/InputField';
import Button from '~/components/Button';
import GameBar from '~/components/GameBar';
import { router } from 'expo-router';
import { socket } from '~/socket';
import { useLobby } from '~/context/LobbyContext';

const Write = () => {
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [prompt, setPrompt] = useState('');
  const { lobbyCode } = useLobby();

  const onSubmit = () => {
    if (prompt.trim() === '') return;

    socket.emit('submit_prompt', { room: lobbyCode, prompt });

    if (timeRemaining === 1) {
      router.replace('/(game)/(play)/voting');
    } else {
      router.replace({
        pathname: '/(game)/(play)/players-waiting',
        params: { timeRemaining: timeRemaining, phase: 'prompts' },
      });
    }
  };
  const onTimerEnd = () => {
    onSubmit();
    //return { shouldRepeat: true, delay: 1.5 };
  };

  const onUpdate = (remainingTime: number) => {
    setTimeRemaining(remainingTime);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <GameBar
        onComplete={onTimerEnd}
        duration={60}
        initialRemainingTime={60}
        onUpdate={onUpdate}
        isAbsolute={true}
      />
      <ScrollView
        className="flex-1 px-5 py-10"
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <KeyboardAvoidingView
          className="flex flex-1 items-center justify-center"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Text className="text-3xl font-bold text-backgroundText">Start Writing!</Text>
          <Text className="text-xl font-bold text-gray-600">
            Create a plot point (Keep it short!)
          </Text>
          <View className="w-full">
            <InputField
              multiline={true}
              numberOfLines={4}
              value={prompt}
              onChangeText={setPrompt}
            />
            <Button
              title="Submit"
              bgVariant="primary"
              textVariant="primary"
              className="mt-5"
              onPress={onSubmit}
            />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Write;
