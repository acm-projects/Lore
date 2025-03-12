import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputField from '~/components/InputField';
import Button from '~/components/Button';
import GameBar from '~/components/GameBar';
import { router } from 'expo-router';

const Write = () => {
  const [timeRemaining, setTimeRemaining] = useState(30);

  const onSubmit = () => {
    if (timeRemaining === 0) {
      router.replace('/(game)/(play)/voting');
    } else {
      router.replace({
        pathname: '/(game)/(play)/players-waiting',
        params: { timeRemaining: timeRemaining },
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
        duration={30}
        initialRemainingTime={30}
        onUpdate={onUpdate}
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
            <InputField multiline={true} numberOfLines={4} />
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
