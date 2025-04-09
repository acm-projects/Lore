import { View, Text, ScrollView, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '~/components/Button';
import { router } from 'expo-router';
import { socket } from '~/socket';
import { getUserAttributes } from '../(user_auth)/CognitoConfig';

type SavedStory = {
  title: string;
  plotPoints: { winningPlotPoint: string; story: string }[];
};

const Stories = () => {
  const [stories, setStories] = useState<SavedStory[]>([]);
  const [loading, setLoading] = useState(true);

  const createGameRoom = () => {
    socket.emit('create_room', (response: any) => {
      if (response.success) {
        router.push(`/(game)/lobby?lobbyCode=${response.roomCode}`);
      } else {
        Alert.alert('Error', 'Failed to create room. Try again.');
      }
    });
  };

  const fetchStories = async () => {
    try {
      const user = await getUserAttributes();
      const res = await fetch(`http://localhost:3001/get-stories?userId=${user.username}`);
      const json = await res.json();
      setStories(json.stories || []);
    } catch (err) {
      console.error('Failed to fetch stories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const openStory = (story: SavedStory) => {
    router.push({
      pathname: '../(game)/StoryView',
      params: {
        title: story.title,
        plotPoints: JSON.stringify(story.plotPoints),
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="mx-3 flex flex-1 justify-between">
        <Text className="text-2xl font-bold text-backgroundText mb-4">Story History</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#ffffff" />
        ) : (
          <ScrollView className="flex-1 space-y-3">
            {stories.map((story, idx) => (
              <TouchableOpacity
                key={idx}
                className="rounded-lg bg-secondary p-4"
                onPress={() => openStory(story)}
              >
                <Text className="text-lg font-semibold text-white">{story.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <View className="flex w-full flex-row gap-x-3 mt-6">
          <Button
            title="Create Story"
            bgVariant="secondary"
            textVariant="secondary"
            className="flex-1"
            onPress={createGameRoom}
          />
          <Button
            title="Join Story"
            bgVariant="primary"
            textVariant="primary"
            className="flex-1"
            onPress={() => {
              router.push('/(game)/join-game');
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Stories;
