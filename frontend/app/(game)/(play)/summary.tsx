import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, Image, ScrollView, Modal, Pressable, TouchableWithoutFeedback, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GameBar from '~/components/GameBar';
import Button from '~/components/Button';
import { useLobby } from '~/context/LobbyContext';
import { socket } from '~/socket';
import { useFocusEffect, useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import { useFonts } from 'expo-font';
import { useAudio } from '~/context/AudioContext';
import MuteButton from '~/components/MuteButton';

const Summary = () => {
  const { lobbyCode } = useLobby();
  const router = useRouter();
  const { playSound, stopSound, isMuted, toggleMute } = useAudio();

  const [bookCover, setBookCover] = useState('');
  const [fullStory, setFullStory] = useState('');
  const [continueCount, setContinueCount] = useState(0);
  const [totalPlayers, setTotalPlayers] = useState(1);
  const [hasPressedContinue, setHasPressedContinue] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  //SFX
  const soundRef = useRef<Audio.Sound | null>(null);

  useFocusEffect(
    // For music, starts playing when writing screen is active, stops when navigated away
    useCallback(() => {
      if (!isMuted) {
        playSound(require('assets/ai-track.mp3'));
      }
      return () => {
        stopSound();
      };
    }, [isMuted])
  );

  const clickSFX = async () => {
    const { sound } = await Audio. Sound.createAsync(
      require('assets/click.mp3'),
    );
    soundRef.current = sound;
    await sound.playAsync()
  }

  useEffect(() => {
    socket.emit("request_story_summary", { room: lobbyCode });

    socket.on("receive_story_image", ({ image }) => {
      setBookCover(image);
    });

    socket.on("receive_full_story", (storyText) => {
      setFullStory(storyText);
    });

    socket.on("update_continue_count", ({ count, total }) => {
      setContinueCount(count);
      setTotalPlayers(total);
    });

    socket.on("go_to_end", () => {
      router.replace("/(game)/(play)/end-screen");
    });

    socket.emit("request_full_story", lobbyCode);
    socket.emit("request_continue_count", lobbyCode);

    return () => {
      socket.off("receive_story_image");
      socket.off("receive_full_story");
      socket.off("update_continue_count");
      socket.off("go_to_end_screen");
    };
  }, [lobbyCode]);

  const handleContinue = () => {
    clickSFX();
    if (!hasPressedContinue) {
      setHasPressedContinue(true);
      socket.emit("continue_pressed", lobbyCode);
    }
  };

  useFonts({
    'JetBrainsMonoRegular': require('assets/fonts/JetBrainsMonoRegular.ttf'),
    'JetBrainsMonoBold': require('assets/fonts/JetBrainsMonoBold.ttf'),
  });

  return (
    <SafeAreaView className="flex-1 bg-background">
      <GameBar isAbsolute={false} headerText="Book Cover & Story" />
      <Image className="w-full" style={{ resizeMode: 'cover', position: 'absolute', height: Dimensions.get("window").height}} source={require("assets/bg7.gif")}/> 

      <ScrollView className="flex-1 px-6 py-4 space-y-6">
        {/* 📕 Book Cover (Tap to Expand) */}
        {bookCover && (
          <>
            <Pressable className="items-center" onPress={() => {clickSFX(); setModalVisible(true)}}>
              <Image
                source={{ uri: bookCover }}
                style={{ width: 200, height: 300, borderRadius: 16 }}
                resizeMode="contain"
              />
            </Pressable>

            {/* 🪟 Fullscreen Modal */}
            <Modal
              visible={modalVisible}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setModalVisible(false)}
            >
              <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                <View className="flex-1 items-center justify-center bg-black/90">
                  <Image
                    source={{ uri: bookCover }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="contain"
                  />
                  <Text style={{fontFamily: 'JetBrainsMonoBold'}} className="mt-4 text-white text-base">Tap anywhere to close</Text>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </>
        )}

        {/* 📖 Full Story Scrollbox */}
        <View className="h-full bg-white/10 rounded-lg p-4">
          <ScrollView showsVerticalScrollIndicator={true}>
            <Text className="text-backgroundText whitespace-pre-line text-base" style={{fontFamily: 'JetBrainsMonoRegular'}}>
              {fullStory}
            </Text>
          </ScrollView>
        </View>

        {/* 👉 Continue Button */}
        <View className="mt-10">
          <TouchableOpacity className=" w-full h-14 justify-center items-center rounded-xl mb-10 mt-4"   
                            style={hasPressedContinue ? {backgroundColor: '#B3B3B3'} : {backgroundColor: '#06D6A1'}} 
            onPress={() => {clickSFX(); handleContinue()}}>
            <Text className="" style={{fontFamily: 'JetBrainsMonoBold', fontSize: 15, textAlign: 'center'}}>
              Continue ({continueCount}/{totalPlayers})
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
      <View className="w-full h-full justify-end items-end right-4 bottom-4" style={{position: 'absolute'}}>
          <MuteButton/>
      </View>
    </SafeAreaView>
  );
};

export default Summary;
