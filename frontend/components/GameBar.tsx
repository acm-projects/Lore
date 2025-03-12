import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from './Button';
import { BookOpen } from 'lucide-react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';

interface GameBarProps {
  onComplete: () => void;
  onUpdate?: (remainingTime: number) => void;
  duration: number;
  isAbsolute?: boolean;
  initialRemainingTime: number;
}

const GameBar = ({
  onComplete,
  duration,
  initialRemainingTime,
  onUpdate,
  isAbsolute = true,
}: GameBarProps) => {
  return (
    <View
      className={`${isAbsolute ? 'absolute left-0 right-0 top-5' : 'mt-5'} flex w-full flex-row items-center justify-between`}>
      <TouchableOpacity className="ml-2 flex  w-24 items-center justify-center rounded-xl bg-primary p-2">
        <BookOpen size={24} color="white" />
        <Text className="text-white">View story</Text>
      </TouchableOpacity>
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
      <TouchableOpacity className="mr-2 flex w-24 items-center justify-center rounded-xl bg-primary p-2">
        <Text className="font-semibold text-white">Join Code</Text>
        <Text className="text-white">0JKML2</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GameBar;
