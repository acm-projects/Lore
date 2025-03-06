import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputField from '~/components/InputField';
import Button from '~/components/Button';
import GameBar from '~/components/GameBar';

const Write = () => {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <GameBar />
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
            <Button title="Submit" bgVariant="primary" textVariant="primary" className="mt-5" />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Write;
