import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from './Button';
import { BookOpen } from 'lucide-react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { useLobby } from '~/context/LobbyContext';

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
  const { lobbyCode } = useLobby();

  return (
    <ContentWrapper
      className={`${isAbsolute ? 'absolute left-0 right-0 top-5' : 'mt-5'} flex w-full max-w-full flex-row items-center justify-between`}>
      <TouchableOpacity
        className="h-16 w-24 items-center justify-center rounded-r-xl bg-primary p-2"
        onPress={() => {console.log("Should have a function named 'onStoryPress' here.")}}>
        <BookOpen size={24} color="white" />
        <Text className="text-white">View story</Text>
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
              <Text className="text-2xl font-bold text-white">{remainingTime}</Text>
            </View>
          )}
        </CountdownCircleTimer>
      )}
      {headerText && (
        <View className="flex-1 px-2">
          <Text className="text-center text-4xl font-bold text-white">{headerText}</Text>
        </View>
      )}
      <TouchableOpacity className="h-16 w-24 items-center justify-center rounded-l-xl bg-primary p-2">
        <Text className="font-semibold text-white">Join Code</Text>
        <Text className="text-white">{lobbyCode}</Text>
      </TouchableOpacity>
    </ContentWrapper>
  );
};

export default GameBar;
