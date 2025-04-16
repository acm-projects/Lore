import { View, Text, ScrollView, TextInput, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '~/components/Button';
import LeaderboardComponent, { Players } from '~/components/Leaderboard';
import { useLobby } from '~/context/LobbyContext';
import { useRouter } from 'expo-router';
import { socket } from '~/socket';
import { getUserAttributes } from '../../(user_auth)/CognitoConfig';

const DebugWinners = () => {
  const { plotPoints } = useLobby();

  useEffect(() => {
    const winners = plotPoints.map(p => ({
      username: p.username,
      avatar: p.avatar_url,
    }));
    console.log("🧠 Winners array from context:", winners);
  }, [plotPoints]);

  return null; // Or render something if needed
};
const EndScreen = () => {
  const router = useRouter();
  const { toggleVisible, lobbyCode, plotPoints } = useLobby();
  const [players, setPlayers] = useState<Players[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [storyTitle, setStoryTitle] = useState('');
  const [storyHistory, setStoryHistory] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

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
      const response = await fetch('http://localhost:3001/save-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.username,
          title: storyTitle,
          winningPrompts: plotPoints.map((p) => p.winningPlotPoint),
          storyHistory,
          winners: plotPoints.map((p) => ({
            username: p.username || "Unknown",
            avatar: p.avatar_url || "",
          })),
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        Alert.alert('✅ Story Saved!', 'Your story was saved to your library.');
        router.replace('/(main)/home');
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
      <ScrollView className="mt-10" contentContainerStyle={{ flex: 1, alignItems: 'center' }}>
        <Text className="text-2xl font-bold text-backgroundText">
          And so the story comes to a close...
        </Text>

        <Button title="View the Full Story" onPress={toggleVisible} className="mt-10 w-[80%]" />

        <Text className="mt-10 text-2xl font-bold text-backgroundText">
          Most Plot Points Chosen
        </Text>
        <LeaderboardComponent players={players} />
        {!showInput && (
          <Button title="Home" onPress={() => setShowInput(true)} className="mt-10 w-[80%]" />
        )}
      </ScrollView>
      {showInput && (
        <View
          style={{
            position: 'absolute',
            top: '30%',
            left: '10%',
            width: '80%',
            backgroundColor: '#2D2D2D',
            padding: 20,
            borderRadius: 12,
            shadowColor: '#000',
            shadowOpacity: 0.4,
            shadowOffset: { width: 0, height: 4 },
            shadowRadius: 10,
            zIndex: 1000,
          }}
        >
          <Text className="mb-2 text-xl font-semibold text-white">Name Your Story:</Text>
          <TextInput
            placeholder="Enter a title..."
            placeholderTextColor="#999"
            className="rounded-md bg-white p-3 text-lg"
            value={storyTitle}
            onChangeText={setStoryTitle}
          />
          <Button title="Submit Story" className="mt-4" onPress={handleSaveStory} />
        </View>
      )}
    <DebugWinners />
    </SafeAreaView>
  );
};

export default EndScreen;
