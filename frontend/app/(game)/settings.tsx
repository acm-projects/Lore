import { View, Text, TouchableOpacity } from 'react-native';
import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TimerPickerModal } from 'react-native-timer-picker';
import { LinearGradient } from 'expo-linear-gradient'; // or `import LinearGradient from "react-native-linear-gradient"`
import { Audio } from 'expo-av'; // for audio feedback (click sound as you scroll)
import * as Haptics from 'expo-haptics'; // for haptic feedback
import Button from '~/components/Button';
import InputSpinner from 'react-native-input-spinner';
import { useFonts } from 'expo-font';
import { ChevronLeft } from 'lucide-react-native';
import { useFocusEffect, useNavigation, useRouter } from 'expo-router';
import { useLobby } from '~/context/LobbyContext';
import { socket } from '~/socket';
import { useNavigationState } from '@react-navigation/native';

const Settings = () => {
  const {
    writingDuration,
    setWritingDuration,
    votingDuration,
    setVotingDuration,
    maxPlayers,
    setMaxPlayers,
    maxRounds,
    setMaxRounds,
  } = useLobby();  
  const { lobbyCode } = useLobby();
  const router = useRouter();
  const [showWritingPicker, setShowWritingPicker] = useState(false);
  const [showVotingPicker, setShowVotingPicker] = useState(false);
  
  useFonts({
    'JetBrainsMonoRegular': require('assets/fonts/JetBrainsMonoRegular.ttf'),
    'JetBrainsMonoBold': require('assets/fonts/JetBrainsMonoBold.ttf'),
  });

  const navigation = useNavigation()

  return (
    <SafeAreaView className="flex-1 bg-backgroundSecondary">
      
      <View className="items-start justify-start h-[60px] flex-row p-4 bg-backgroundSecondary">
        <View className="items-start justify-start flex-row">
            <ChevronLeft size={25} color={"white"} onPress={() => {navigation.goBack()}}/>
        </View>
          <Text style={{fontFamily: 'JetBrainsMonoRegular', fontSize: 20, color: 'white'}}>Edit Lobby Settings</Text>
      </View>

      <View className="w-full h-full items-center pt-20 bg-background">
      {/* Writing Duration */}
      <View className="w-full px-3">
        <Text style={{fontFamily: 'JetBrainsMonoRegular'}} numberOfLines={1} adjustsFontSizeToFit={true} 
              className="text-center text-2xl font-bold text-backgroundText">{`Writing Duration: ${writingDuration.minutes ? `${writingDuration.minutes} minutes` : ``} ${writingDuration.seconds} seconds`}</Text>
        <TouchableOpacity className="bg-secondaryText w-full h-[50px] justify-center items-center rounded-xl" onPress={() => setShowWritingPicker(true)}>
          <Text style={{fontFamily: 'JetBrainsMonoRegular', fontSize: 18}} numberOfLines={1} adjustsFontSizeToFit={true} 
              className="text-center text-2xl font-bold text-backgroundText">Set Writing Duration</Text>
        </TouchableOpacity>
      </View>

      {/* Voting Duration */}
      <View className="mt-4 w-full px-3">
        <Text style={{fontFamily: 'JetBrainsMonoRegular'}} numberOfLines={1} adjustsFontSizeToFit={true} 
              className="text-center text-2xl font-bold text-backgroundText">{`Voting Duration: ${votingDuration.minutes ? `${votingDuration.minutes} minutes` : ``} ${votingDuration.seconds} seconds`}</Text>
        <TouchableOpacity className="bg-secondaryText w-full h-[50px] justify-center items-center rounded-xl" onPress={() => setShowVotingPicker(true)}>
          <Text style={{fontFamily: 'JetBrainsMonoRegular', fontSize: 18}} numberOfLines={1} adjustsFontSizeToFit={true} 
              className="text-center text-2xl font-bold text-backgroundText">Set Voting Duration</Text>
        </TouchableOpacity>
      </View>

      {/* Max Rounds */}
      <View className="mt-10 flex w-full flex-row items-center gap-x-3 px-3">
        <Text style={{fontFamily: 'JetBrainsMonoRegular'}} numberOfLines={1} adjustsFontSizeToFit={true} 
              className="text-center text-2xl font-bold text-backgroundText">Max Rounds:</Text>
        <InputSpinner
          max={10}
          min={1}
          step={1}
          fontFamily='JetBrainsMonoRegular'
          value={maxRounds}
          skin="round"
          onChange={(value: number) => setMaxRounds(value)}
          style={{ flex: 1}}
        />
      </View>

      {/* Max Players */}
      <View className="mt-4 flex w-full flex-row items-center gap-x-3 px-3">
        <Text style={{fontFamily: 'JetBrainsMonoRegular'}} numberOfLines={1} adjustsFontSizeToFit={true} 
              className="text-center text-2xl font-bold text-backgroundText">Max Players:</Text>
        <InputSpinner
          max={10}
          min={2}
          step={1}
          fontFamily='JetBrainsMonoRegular'
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

      {/* Save Button */}
      <View className="mt-8 w-full px-3">
      <TouchableOpacity className="bg-primary w-full h-[50px] justify-center items-center rounded-xl"
          onPress={() => {
            socket.emit("update_room_settings", {
              roomCode: lobbyCode,
              settings: {
                maxPlayers,
                maxRounds,
              },
            });
          }}>
        <Text style={{fontFamily: 'JetBrainsMonoRegular'}} numberOfLines={1} adjustsFontSizeToFit={true}
              className="text-center text-2xl font-bold text-backgroundText">
          Save Settings
        </Text>

      </TouchableOpacity>
      </View>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
