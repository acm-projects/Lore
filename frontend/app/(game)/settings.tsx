import { View, Text } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TimerPicker, TimerPickerModal } from 'react-native-timer-picker';
import { LinearGradient } from 'expo-linear-gradient'; // or `import LinearGradient from "react-native-linear-gradient"`
import { Audio } from 'expo-av'; // for audio feedback (click sound as you scroll)
import * as Haptics from 'expo-haptics'; // for haptic feedback
import Button from '~/components/Button';
import InputSpinner from 'react-native-input-spinner';

const Settings = () => {
  const [showWritingPicker, setShowWritingPicker] = useState(false);
  const [showVotingPicker, setShowVotingPicker] = useState(false);
  const [writingDuration, setWritingDuration] = useState<{ minutes: number; seconds: number }>({
    minutes: 0,
    seconds: 30,
  });
  const [votingDuration, setVotingDuration] = useState<{ minutes: number; seconds: number }>({
    minutes: 0,
    seconds: 30,
  });

  const [maxRounds, setMaxRounds] = useState(3);
  const [maxPlayers, setMaxPlayers] = useState(4);
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-background">
      {/* Writing Duration */}
      <View className="w-full px-3">
        <Text className="text-center text-2xl font-bold text-backgroundText">{`Writing Duration: ${writingDuration.minutes ? `${writingDuration.minutes} minutes` : ``} ${writingDuration.seconds} seconds`}</Text>
        <Button title="Set Writing Duration" onPress={() => setShowWritingPicker(true)} />
      </View>
      {/* Voting Duration */}
      <View className="mt-4 w-full px-3">
        <Text className="text-center text-2xl font-bold text-backgroundText">{`Voting Duration: ${votingDuration.minutes ? `${votingDuration.minutes} minutes` : ``} ${votingDuration.seconds} seconds`}</Text>
        <Button title="Set Voting Duration" onPress={() => setShowVotingPicker(true)} />
      </View>
      {/* Max Rounds */}
      <View className="mt-4 flex w-full flex-row items-center gap-x-3 px-3">
        <Text className="text-center text-2xl font-bold text-backgroundText">Max Rounds:</Text>
        <InputSpinner
          max={10}
          min={1}
          step={1}
          value={maxRounds}
          skin="round"
          onChange={(value: number) => setMaxRounds(value)}
          style={{ flex: 1 }}
        />
      </View>
      {/* Max Players */}
      <View className="mt-4 flex w-full flex-row items-center gap-x-3 px-3">
        <Text className="text-center text-2xl font-bold text-backgroundText">Max Players:</Text>
        <InputSpinner
          max={10}
          min={2}
          step={1}
          value={maxPlayers}
          skin="round"
          onChange={(value: number) => setMaxPlayers(value)}
          style={{ flex: 1 }}
        />
      </View>
      <TimerPickerModal
        visible={showWritingPicker}
        setIsVisible={setShowWritingPicker}
        onConfirm={(pickedDuration) => {
          setWritingDuration(pickedDuration);
          setShowWritingPicker(false);
        }}
        hideHours
        initialValue={writingDuration}
        modalTitle="Set Writing Duration"
        onCancel={() => setShowWritingPicker(false)}
        closeOnOverlayPress
        Audio={Audio}
        LinearGradient={LinearGradient}
        Haptics={Haptics}
        styles={{
          theme: 'dark',
        }}
        modalProps={{
          overlayOpacity: 0.2,
        }}
      />
      <TimerPickerModal
        visible={showVotingPicker}
        setIsVisible={setShowVotingPicker}
        onConfirm={(pickedDuration) => {
          setVotingDuration(pickedDuration);
          setShowVotingPicker(false);
        }}
        hideHours
        initialValue={votingDuration}
        modalTitle="Set Voting Duration"
        onCancel={() => setShowVotingPicker(false)}
        closeOnOverlayPress
        Audio={Audio}
        LinearGradient={LinearGradient}
        Haptics={Haptics}
        styles={{
          theme: 'dark',
        }}
        modalProps={{
          overlayOpacity: 0.2,
        }}
      />
    </SafeAreaView>
  );
};

export default Settings;
