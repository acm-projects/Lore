import { View, Text, ScrollView, TextInput, Alert, Image, Dimensions, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '~/components/Button';
import LeaderboardComponent, { Players } from '~/components/Leaderboard';
import { useLobby } from '~/context/LobbyContext';
import { useFocusEffect, useRouter } from 'expo-router';
import { socket } from '~/socket';
import { getUserAttributes } from '../../(user_auth)/CognitoConfig';
import { Audio } from 'expo-av';
import { useAudio } from '~/context/AudioContext';
import MuteButton from '~/components/MuteButton';

const EndScreen = () => {
  const router = useRouter();
  const { toggleVisible, lobbyCode, plotPoints } = useLobby();
  const [players, setPlayers] = useState<Players[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [storyTitle, setStoryTitle] = useState('');
  const [storyHistory, setStoryHistory] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  //SFX
  const { playSound, stopSound, isMuted, toggleMute } = useAudio();
  const soundRef = useRef<Audio.Sound | null>(null);

  useFocusEffect( // For music, starts playing when writing screen is active, stops when navigated away
    useCallback(() => {
      if(!isMuted){
        playSound(require('assets/end-screen-track.mp3'));
      } 
      return() => {
        stopSound();
      }
    }, [isMuted]
  ))
  const clickSFX = async () => {
    const { sound } = await Audio. Sound.createAsync(
      require('assets/click.mp3'),
    );
    soundRef.current = sound;
    await sound.playAsync()
  }

  // Fetch story history from the server
  useEffect(() => {
    socket.emit('request_full_story', lobbyCode);
    socket.emit('request_story_summary', { room: lobbyCode });
    socket.on('receive_full_story', (story: string) => {
      // Split the story into chunks (3 paragraphs per round)
      const storyChunks = story
        .split(/\n\s*\n/) // split on empty lines
        .reduce((chunks: string[][], para: string, i) => {
          const chunkIndex = Math.floor(i / 3);
          if (!chunks[chunkIndex]) chunks[chunkIndex] = [];
          chunks[chunkIndex].push(para);
          return chunks;
        }, [])
        .map((group) => group.join('\n\n'));

      setStoryHistory(storyChunks);
    });

    socket.on('receive_story_image', ({ image }) => {
      setImageUrl(image || null);
    });

    return () => {
      socket.off('receive_full_story');
      socket.off('receive_story_image');
    };
  }, [lobbyCode]);

  // Request rankings from the server
  useEffect(() => {
    socket.emit('request_rankings', lobbyCode);
    socket.on('receive_rankings', (rankings) => {
      const formattedPlayers = rankings.map((player, index) => ({
        avatar: '',
        plotPoints: player.plotPoints,
        username: `Player ${index + 1}: ${player.id}`,
      }));
      setPlayers(formattedPlayers);
    });

    return () => {
      socket.off('receive_rankings');
    };
  }, [lobbyCode]);

  const handleSaveStory = async () => {
    if (!storyTitle.trim()) {
      Alert.alert('Missing Title', 'Please enter a title for your story.');
      return;
    }

    try {
      const user = await getUserAttributes();
      const response = await fetch('https://lore-8hal.onrender.com/save-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.username,
          title: storyTitle,
          winningPrompts: plotPoints.map((p) => p.winningPlotPoint),
          storyHistory,
          winners: plotPoints.map((p) => ({
            username: p.username || "Unknown", 
            avatar: p.avatar_url ||  "", 
          })),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('✅ Story Saved!', 'Your story was saved to your library.');
        router.replace('/(main)/profile');
      } else {
        Alert.alert('❌ Error', data.error || 'Failed to save story.');
      }
    } catch (err) {
      console.error('Save error:', err);
      Alert.alert('❌ Error', 'Something went wrong while saving your story.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Image className="w-full" style={{ resizeMode: 'cover', position: 'absolute', height: Dimensions.get("window").height}} source={require("assets/bg6.gif")}/> 
      
      <ScrollView className="flex-1 py-10" automaticallyAdjustKeyboardInsets={true}>
        <View className="flex-1 items-center">
          <Text className="text-backgroundText text-center"
                style={{fontFamily: 'JetBrainsMonoBold', fontSize: 30, textAlign: 'center'}} >
            And So The Story Comes To A Close...
          </Text>

          <TouchableOpacity className="bg-primary w-[80%] h-[8%] justify-center items-center rounded-xl my-6"  
                            onPress={() => {clickSFX(); toggleVisible()}}>
                  <Text className="" style={{fontFamily: 'JetBrainsMonoBold', fontSize: 15, textAlign: 'center'}}>
                    View The Full Story
                  </Text>
          </TouchableOpacity>

          <Text className="text-2xl font-bold text-backgroundText"
                style={{fontFamily: 'JetBrainsMonoBold', fontSize: 20, textAlign: 'center'}}>
            Most Plot Points Chosen
          </Text>
          <LeaderboardComponent players={players} />

          {/* Show story title input when "Home" is pressed */}
          {showInput && (
            <View className="mb-20 mt-10 w-[80%]">
              <Text className="mb-2 text-backgroundText"
                    style={{fontFamily: 'JetBrainsMonoBold', fontSize: 20, textAlign: 'center'}}>
                Name Your Story!
              </Text>
              <TextInput
                placeholder="Enter a title..."
                placeholderTextColor="#999"
                className="h-[40px] w-full rounded-xl bg-black px-2 color-white items-center justify-center pb-2"
                value={storyTitle}
                onChangeText={setStoryTitle}
              />
              <TouchableOpacity className="bg-primary w-full h-[20%] justify-center items-center rounded-xl mb-10 mt-4"  
                                onPress={() => {clickSFX(); handleSaveStory()}}>
                  <Text className="" style={{fontFamily: 'JetBrainsMonoBold', fontSize: 15, textAlign: 'center'}}>
                    Submit Story
                  </Text>
              </TouchableOpacity>
            </View>
          )}

          {!showInput && (
            <TouchableOpacity className="bg-primary w-[80%] h-[8%] justify-center items-center rounded-xl mb-10 mt-4"  
              onPress={() => {clickSFX(); setShowInput(true)}}>
              <Text className="" style={{fontFamily: 'JetBrainsMonoBold', fontSize: 15, textAlign: 'center'}}>
                Save Story
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
        <View className="w-full h-full justify-end items-end right-4 bottom-4" style={{position: 'absolute'}}>
            <MuteButton/>
        </View>
    </SafeAreaView>
  );
};

export default EndScreen;
