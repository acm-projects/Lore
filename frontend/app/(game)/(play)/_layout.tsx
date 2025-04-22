import { Stack } from 'expo-router';
import { Undo2 } from 'lucide-react-native';
import { View } from 'react-native';
import GameBar from '~/components/GameBar';
import StoryView from '~/components/story-view';
import { LobbyProvider, useLobby } from '~/context/LobbyContext';
import Modal from 'react-native-modal';
import { AudioProvider } from '~/context/AudioContext';

const PlayLayout = () => {
  const { isVisible, toggleVisible } = useLobby();

  return (
    <>
    <AudioProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="write" />
        <Stack.Screen name="players-waiting" />
        <Stack.Screen name="voting" />
        <Stack.Screen name="ai-gen" />
        <Stack.Screen name="end-screen" />
      </Stack>
      <Modal
        style={{ margin: 0 }}
        isVisible={isVisible}
        animationIn="slideInLeft"
        animationOut="slideOutLeft">
        <View className="flex h-[100px] w-full flex-row items-center justify-between bg-backgroundSecondary pt-4">
          <View className="h-[40px] w-[50px] items-center justify-center rounded-r-lg bg-primaryAccent">
            <Undo2
              color="white"
              onPress={() => {
                toggleVisible();
              }}
              />
          </View>
        </View>
        <StoryView code="43255"></StoryView>
      </Modal>
    </AudioProvider>
    </>
  );
};

export default PlayLayout;
