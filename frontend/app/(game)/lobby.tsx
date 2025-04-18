import { View, Text, ScrollView, TouchableOpacity, Alert, Dimensions, Image } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';
import Button from '~/components/Button';
import ProfileDisplay from '~/components/ProfileDisplay';
import { useLobby } from '~/context/LobbyContext';
import { socket } from '~/socket';
import * as Clipboard from 'expo-clipboard';
import { useFonts } from 'expo-font';
import { getUserAttributes } from '../(user_auth)/CognitoConfig';
import { ChevronLeft, Music, Volume2, VolumeOff } from 'lucide-react-native';
import { Audio } from 'expo-av';
import { useAudio } from '~/context/AudioContext';
import { useNavigationState } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { LinearGradient } from 'react-native-svg';
import * as Haptics from 'expo-haptics'; // for haptic feedback
import InputSpinner from 'react-native-input-spinner';
import { TimerPickerModal } from 'react-native-timer-picker';
import MuteButton from '~/components/MuteButton';
import AsyncStorage from '@react-native-async-storage/async-storage'; // only client-side

const Lobby = () => {
  // ----------------------------------------- SETTINGS ------------------------------------------------------------- //
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
  const [showWritingPicker, setShowWritingPicker] = useState(false);
  const [showVotingPicker, setShowVotingPicker] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { lobbyCode } = useLocalSearchParams();
  let [isSettingsVisible, setSettingsVisible] = useState(false);
  // ----------------------------------------------------------------------------------------------------------------- //

  const { setLobbyCode, players, setPlayers, setCreator } = useLobby();
  const [isCreator, setIsCreator] = useState(false);

  useFonts({
    JetBrainsMonoRegular: require('assets/fonts/JetBrainsMonoRegular.ttf'),
    JetBrainsMonoBold: require('assets/fonts/JetBrainsMonoBold.ttf'),
  });

  //SFX
  const { playSound, stopSound, isMuted, toggleMute } = useAudio();
  const soundRef = useRef<Audio.Sound | null>(null);

  useFocusEffect(
    // For music, starts playing when writing screen is active, stops when navigated away
    useCallback(() => {
      if (!isMuted) {
        playSound(require('assets/lobby-track.mp3'));
      }
      return () => {
        stopSound();
      };
    }, [isMuted])
  );

  const clickSFX = async () => {
    const { sound } = await Audio.Sound.createAsync(require('assets/click.mp3'));
    soundRef.current = sound;
    await sound.playAsync();
  };

  useEffect(() => {
    if (!lobbyCode) {
      console.log('No lobby code found');
      router.replace('/');
      return;
    }

    setLobbyCode(lobbyCode as string);

    const joinAfterConnect = async () => {
      try{
        const user = await getUserAttributes(); // from CognitoConfig
        let playerId = null;

        try {
          playerId = await AsyncStorage.getItem('playerId');
        } catch (err) {
          console.warn('⚠️ Failed to fetch playerId from AsyncStorage:', err);
        }

        // Build payload
        const joinPayload = {
          room: lobbyCode,
          cognitoSub: user.sub, // always include this
        };

        if (playerId) {
          joinPayload.playerId = playerId; // only include if available
        }

        socket.emit('join_room', joinPayload, (response: any) => {
          if (!response.success) {
            console.error('❌ Failed to join room:', response.message);
            router.replace('/');
          } else {
            setCreator(response.creatorId);
            setIsCreator(response.creatorId === socket.id);
          }
        });
      } catch (err) {
        console.error("❌ Failed to get user attributes:", err);
        router.replace('/');
      }
    };

    if (socket.connected) {
      joinAfterConnect();
    } else {
      socket.once('connect', joinAfterConnect);
    }

    socket.on('update_users', (users) => {
      console.log('👥 Updated Users List:', users);
      setPlayers(users || []);
    });

    socket.on('game_started', () => {
      console.log('🎮 Game Started! Navigating to prompt.tsx');
      router.replace('/(game)/(play)/write');
    });

    return () => {
      socket.off('update_users');
      socket.off('game_started');
      socket.off('connect', joinAfterConnect);
    };
  }, [lobbyCode]);

  const startGame = () => {
    socket.emit('start_game', lobbyCode);
  };

  const onCodePress = async () => {
    await Clipboard.setStringAsync(lobbyCode.toString());
    Alert.alert('Copied!', 'Lobby code copied to clipboard.');
  };

  const onEditSettingsPress = () => {
    setSettingsVisible(true);
  };

  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Image
        className="w-full"
        style={{
          resizeMode: 'cover',
          position: 'absolute',
          height: Dimensions.get('window').height,
        }}
        source={require('assets/bg5.gif')}
      />

      {/* --------------------------------------------- SETTINGS ----------------------------------------------------------*/}
      <Modal
        animationIn={'slideInRight'}
        animationOut={'slideOutRight'}
        className="flex-1"
        style={{ marginHorizontal: 0, marginBottom: 0 }}
        isVisible={isSettingsVisible}>
        <SafeAreaView className="flex-1 bg-backgroundSecondary">
          <View className="h-[60px] flex-row items-start justify-start bg-backgroundSecondary p-4">
            <View className="flex-row items-start justify-start">
              <ChevronLeft
                size={25}
                color={'white'}
                onPress={() => {
                  setSuccessMessage('');
                  setSettingsVisible(false);
                }}
              />
            </View>
            <Text style={{ fontFamily: 'JetBrainsMonoRegular', fontSize: 20, color: 'white' }}>
              Edit Lobby Settings
            </Text>
          </View>

          <View className="h-full w-full items-center bg-background pt-20">
            {/* Writing Duration */}
            <View className="w-full px-3">
              <Text
                style={{ fontFamily: 'JetBrainsMonoRegular' }}
                numberOfLines={1}
                adjustsFontSizeToFit={true}
                className="text-center text-2xl font-bold text-backgroundText">{`Writing Duration: ${writingDuration.minutes ? `${writingDuration.minutes} minutes` : ``} ${writingDuration.seconds} seconds`}</Text>
              <TouchableOpacity
                className="h-[50px] w-full items-center justify-center rounded-xl bg-secondaryText"
                onPress={() => {
                  clickSFX();
                  setShowWritingPicker(true);
                }}>
                <Text
                  style={{ fontFamily: 'JetBrainsMonoRegular', fontSize: 18 }}
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}
                  className="text-center text-2xl font-bold text-backgroundText">
                  Set Writing Duration
                </Text>
              </TouchableOpacity>
            </View>

            {/* Voting Duration */}
            <View className="mt-4 w-full px-3">
              <Text
                style={{ fontFamily: 'JetBrainsMonoRegular' }}
                numberOfLines={1}
                adjustsFontSizeToFit={true}
                className="text-center text-2xl font-bold text-backgroundText">{`Voting Duration: ${votingDuration.minutes ? `${votingDuration.minutes} minutes` : ``} ${votingDuration.seconds} seconds`}</Text>
              <TouchableOpacity
                className="h-[50px] w-full items-center justify-center rounded-xl bg-secondaryText"
                onPress={() => {
                  clickSFX();
                  setShowVotingPicker(true);
                }}>
                <Text
                  style={{ fontFamily: 'JetBrainsMonoRegular', fontSize: 18 }}
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}
                  className="text-center text-2xl font-bold text-backgroundText">
                  Set Voting Duration
                </Text>
              </TouchableOpacity>
            </View>

            {/* Max Rounds */}
            <View className="mt-10 flex w-full flex-row items-center gap-x-3 px-3">
              <Text
                style={{ fontFamily: 'JetBrainsMonoRegular' }}
                numberOfLines={1}
                adjustsFontSizeToFit={true}
                className="text-center text-2xl font-bold text-backgroundText">
                Max Rounds:
              </Text>
              <InputSpinner
                max={10}
                min={1}
                step={1}
                fontFamily="JetBrainsMonoRegular"
                value={maxRounds}
                skin="round"
                onChange={(value: number) => {
                  clickSFX();
                  setMaxRounds(value);
                }}
                style={{ flex: 1 }}
              />
            </View>

            {/* Max Players */}
            <View className="mt-4 flex w-full flex-row items-center gap-x-3 px-3">
              <Text
                style={{ fontFamily: 'JetBrainsMonoRegular' }}
                numberOfLines={1}
                adjustsFontSizeToFit={true}
                className="text-center text-2xl font-bold text-backgroundText">
                Max Players:
              </Text>
              <InputSpinner
                max={10}
                min={2}
                step={1}
                fontFamily="JetBrainsMonoRegular"
                value={maxPlayers}
                skin="round"
                onChange={(value: number) => {
                  clickSFX();
                  setMaxPlayers(value);
                }}
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
              <TouchableOpacity
                className="h-[50px] w-full items-center justify-center rounded-xl bg-primary"
                onPress={() => {
                  clickSFX();
                  try {
                    socket.emit('update_room_settings', {
                      roomCode: lobbyCode,
                      settings: {
                        maxPlayers,
                        maxRounds,
                      },
                    });
                    setSuccessMessage('Updated Room Settings Successfully!');
                  } catch (err) {}
                }}>
                <Text
                  style={{ fontFamily: 'JetBrainsMonoRegular' }}
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}
                  className="text-center text-2xl font-bold text-backgroundText">
                  Save Settings
                </Text>
              </TouchableOpacity>
            </View>
            {successMessage && (
              <Text
                style={{ color: 'green', fontFamily: 'JetBrainsMonoRegular', paddingBottom: 6 }}>
                {successMessage}
              </Text>
            )}
          </View>
        </SafeAreaView>
      </Modal>
      {/* -------------------------------------------------------------------------------------------------------------*/}

      <View className="mx-4 mt-2 flex-row items-start justify-between">
        <ChevronLeft
          size={25}
          color={'white'}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <MuteButton />
      </View>
      <View className="mt-10 self-center">
        <Text
          style={{ fontFamily: 'JetBrainsMonoBold', fontSize: 36 }} // ⬅️ Increased from 30s
          className="font-bold text-backgroundText">
          Join Code:
        </Text>

        <TouchableOpacity
          className="mt-4 rounded-full bg-primary px-6 py-4"
          onPress={() => {
            clickSFX();
            onCodePress();
          }}>
          <Text
            style={{ fontFamily: 'JetBrainsMonoBold', fontSize: 32 }} // ⬅️ Increased from 24-ish
            className="text-center font-bold text-primaryText">
            {lobbyCode}
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView className="flex-1 px-5 py-10">
        {players.length > 0 ? (
          players.map((player, index) => (
            <View key={index} className="mb-3">
              <ProfileDisplay
                key={index}
                username={player.name || player.id.substring(0, 6)}
                avatar={player.avatar}
              />
            </View>
          ))
        ) : (
          <Text
            style={{ fontFamily: 'JetBrainsMonoBold' }}
            className="text-center text-backgroundText">
            Waiting for players...
          </Text>
        )}
      </ScrollView>
      {isCreator && (
        <View className="mx-2 mb-2 flex flex-row justify-between">
          <TouchableOpacity
            className="h-[50px] w-[175px] items-center justify-center rounded-xl bg-secondaryText"
            onPress={() => {
              clickSFX();
              onEditSettingsPress();
            }}>
            <Text style={{ fontFamily: 'JetBrainsMonoBold', color: 'white' }}>Edit Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="h-[50px] w-[175px] items-center justify-center rounded-xl bg-primaryAccent"
            onPress={() => {
              clickSFX();
              startGame();
            }}>
            <Text style={{ fontFamily: 'JetBrainsMonoBold', color: 'white' }}>Start Game</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Lobby;
