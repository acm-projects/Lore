import { View, Text, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from './Button';
import { BookOpen } from 'lucide-react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { useLobby } from '~/context/LobbyContext';
import { router } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { useFonts } from 'expo-font';

interface GameBarProps {
  onComplete?: () => void;
  onUpdate?: (remainingTime: number) => void;
  duration?: number;
  isAbsolute?: boolean;
  initialRemainingTime?: number;
  headerText?: string;
}

const GameBar = ({
  onComplete = () => {},
  duration = 30,
  initialRemainingTime = 30,
  onUpdate,
  isAbsolute = true,
  headerText,
}: GameBarProps) => {
  const ContentWrapper = isAbsolute ? SafeAreaView : View;
  const { lobbyCode, toggleVisible } = useLobby();

  const onStoryPress = () => {
    toggleVisible();
    //router.push('/(game)/(play)/story-view');
  };

  const onCodePress = async () => {
    await Clipboard.setStringAsync(lobbyCode);
    Alert.alert('Copied!', 'Lobby code copied to clipboard.');
  };

  useFonts({
    'JetBrainsMonoRegular': require('assets/fonts/JetBrainsMonoRegular.ttf'),
    'JetBrainsMonoBold': require('assets/fonts/JetBrainsMonoBold.ttf'),
  });

  return (
    <ContentWrapper
      style={isAbsolute ? { zIndex: 9999 } : {}}
      className={`${isAbsolute ? 'absolute left-0 right-0 top-5' : 'mt-5'} flex w-full max-w-full flex-row items-center justify-between`}>
      <TouchableOpacity
        className="ml-2 flex w-24 items-center justify-center rounded-xl bg-primary p-2"
        onPress={onStoryPress}>
        <BookOpen size={24} color="white" />
        <Text style={{fontFamily: 'JetBrainsMonoRegular'}} numberOfLines={1} adjustsFontSizeToFit={true} className="text-white">View story</Text>
      </TouchableOpacity>
      {!headerText && (
        <CountdownCircleTimer
          isPlaying
          duration={duration}
          colors={['#06D6A1', '#F7B801', '#A30000', '#A30000']}
          size={50}
          strokeWidth={5}
          initialRemainingTime={initialRemainingTime}
          onUpdate={onUpdate}
          onComplete={onComplete}
          colorsTime={[21, 15, 6, 0]}>
          {({ remainingTime }) => (
            <View className="flex flex-row items-center justify-center">
              <Text style={{fontFamily: 'JetBrainsMonoRegular'}} className="text-2xl font-bold text-white">{remainingTime}</Text>
            </View>
          )}
        </CountdownCircleTimer>
      )}
      {headerText && (
        <View className="flex-1 px-2">
          <Text style={{fontFamily: 'JetBrainsMonoRegular'}} className="text-center text-4xl font-bold text-white">{headerText}</Text>
        </View>
      )}
      <TouchableOpacity
        className="mr-2 flex w-24 items-center justify-center rounded-xl bg-primary p-2"
        onPress={onCodePress}>
        <Text style={{fontFamily: 'JetBrainsMonoBold'}} numberOfLines={1} adjustsFontSizeToFit={true} className="font-semibold text-white">Join Code</Text>
        <Text style={{fontFamily: 'JetBrainsMonoRegular'}} numberOfLines={1} adjustsFontSizeToFit={true} className="text-white">{lobbyCode}</Text>
      </TouchableOpacity>
    </ContentWrapper>
  );
};

export default GameBar;
