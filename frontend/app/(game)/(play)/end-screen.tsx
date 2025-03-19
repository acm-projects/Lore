import { View, Text, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '~/components/Button';
import LeaderboardComponent, { Players } from '~/components/Leaderboard';
import { useLobby } from '~/context/LobbyContext';
import { useRouter } from 'expo-router';
import { socket } from '~/socket';

const EndScreen = () => {
  const router = useRouter();
  const { toggleVisible, lobbyCode } = useLobby();
  const [players, setPlayers] = useState<Players[]>([]);

  useEffect(() => {
    // Request rankings from the server
    socket.emit('request_rankings', lobbyCode);

    // Listen for ranking data
    socket.on('receive_rankings', (rankings) => {
      console.log('🏆 Received Player Rankings:', rankings);

      // ✅ Transform rankings into correct format for LeaderboardComponent
      const formattedPlayers = rankings.map((player, index) => ({
        avatar: '', // Placeholder for now
        plotPoints: player.plotPoints,
        username: `Player ${index + 1}: ${player.id}`
      }));

      setPlayers(formattedPlayers);
    });

    return () => {
      socket.off('receive_rankings'); // Cleanup listener
    };
  }, [lobbyCode]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="mt-10" contentContainerStyle={{ flex: 1, alignItems: 'center' }}>
        <Text className="text-2xl font-bold text-backgroundText">
          And so the story comes to a close...
        </Text>
        <Button
          title="View the Full Story"
          onPress={toggleVisible}
          className="mt-10 w-[80%]"
        />
        <Text className="mt-10 text-2xl font-bold text-backgroundText">
          Most Plot Points Chosen
        </Text>
        <LeaderboardComponent players={players} />
        <Button
          title="Home"
          onPress={() => {
            router.replace('/(main)/home');
          }}
          className="mt-10 w-[80%]"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default EndScreen;
