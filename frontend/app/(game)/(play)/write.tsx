import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Image, Dimensions, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputField from '~/components/InputField';
import Button from '~/components/Button';
import GameBar from '~/components/GameBar';
import { router } from 'expo-router';
import { socket } from '~/socket';
import { useLobby } from '~/context/LobbyContext';
import { useFonts } from 'expo-font';

const Write = () => {
  const [timeRemaining, setTimeRemaining] = useState(10);
  const [prompt, setPrompt] = useState('');
  const { lobbyCode } = useLobby();

  const onSubmit = () => {

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

  useFonts({
    'JetBrainsMonoRegular': require('assets/fonts/JetBrainsMonoRegular.ttf'),
    'JetBrainsMonoBold': require('assets/fonts/JetBrainsMonoBold.ttf'),
  });

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Image className="w-full" style={{resizeMode: 'cover', position: 'absolute', height: Dimensions.get("window").height}} source={require("assets/bg1.gif")}/> 
      
      <GameBar
        onComplete={onTimerEnd}
        duration={10}
        initialRemainingTime={10}
        onUpdate={onUpdate}
        isAbsolute={true}
      />
      <ScrollView
        className="flex-1 px-5 py-10"
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <KeyboardAvoidingView
          className="flex flex-1 items-center justify-center"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Text style={{fontFamily: 'JetBrainsMonoRegular'}} numberOfLines={1} adjustsFontSizeToFit={true} 
                className="text-3xl font-bold text-backgroundText">Start Writing!</Text>
          <Text style={{fontFamily: 'JetBrainsMonoRegular'}} numberOfLines={1} adjustsFontSizeToFit={true} 
                className="text-xl font-bold color-secondaryText">
            Create a plot point (Keep it short!)
          </Text>
          <View className="w-full">
            <InputField
              multiline={true}
              numberOfLines={4}
              value={prompt}
              onChangeText={setPrompt}
            />
          <TouchableOpacity className="bg-primaryAccent w-full h-[50px] justify-center items-center rounded-xl"
                                          onPress={() => {onSubmit()}}>
            <Text style={{fontFamily: 'JetBrainsMonoBold', color: "white", fontSize: 25}}>Submit</Text>
          </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Write;
