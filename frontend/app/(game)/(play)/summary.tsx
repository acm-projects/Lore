import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, Modal, Pressable, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GameBar from '~/components/GameBar';
import Button from '~/components/Button';
import { useLobby } from '~/context/LobbyContext';
import { socket } from '~/socket';
import { useRouter } from 'expo-router';

const Summary = () => {
  const { lobbyCode } = useLobby();
  const router = useRouter();

  const [bookCover, setBookCover] = useState('');
  const [fullStory, setFullStory] = useState('');
  const [continueCount, setContinueCount] = useState(0);
  const [totalPlayers, setTotalPlayers] = useState(1);
  const [hasPressedContinue, setHasPressedContinue] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

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

    socket.on("go_to_next", () => {
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
    if (!hasPressedContinue) {
      setHasPressedContinue(true);
      socket.emit("continue_pressed", lobbyCode);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <GameBar isAbsolute={false} headerText="Book Cover & Story" />

      <ScrollView className="flex-1 px-6 py-4 space-y-6">
        {/* 📕 Book Cover (Tap to Expand) */}
        {bookCover && (
          <>
            <Pressable className="items-center" onPress={() => setModalVisible(true)}>
              <Image
                source={{ uri: bookCover }}
                style={{ width: 600, height: 900, borderRadius: 16 }}
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
                    style={{ width: '80%', height: '80%' }}
                    resizeMode="contain"
                  />
                  <Text className="mt-4 text-white text-base">Tap anywhere to close</Text>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </>
        )}

        {/* 📖 Full Story Scrollbox */}
        <View className="h-64 bg-white/10 rounded-lg p-4">
          <ScrollView showsVerticalScrollIndicator={true}>
            <Text className="text-backgroundText whitespace-pre-line text-base">
              {fullStory}
            </Text>
          </ScrollView>
        </View>

        {/* 👉 Continue Button */}
        <View className="mt-10">
          <Button
            title={`Continue (${continueCount}/${totalPlayers})`}
            bgVariant={hasPressedContinue ? 'secondary' : 'primary'}
            textVariant={hasPressedContinue ? 'secondary' : 'primary'}
            onPress={handleContinue}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Summary;
