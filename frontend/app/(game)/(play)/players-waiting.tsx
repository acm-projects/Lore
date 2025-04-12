import { View, Text, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import GameBar from '~/components/GameBar';
import ProfileDisplay from '~/components/ProfileDisplay';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useLobby } from '~/context/LobbyContext';
import { socket } from '~/socket';

const PlayersWaiting = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const phase = params.phase;
  const { lobbyCode, addPlotPoint } = useLobby();
  const timeRemaining = params.timeRemaining ? parseInt(params.timeRemaining as string) : 30;
  const round = params.round ? parseInt(params.round as string) : 1;
  const [players, setPlayers] = useState<{ id: string; name: string; currentScreen?: string }[]>([]);

  useEffect(() => {
    console.log(`🚀 Waiting Screen Loaded | Phase: ${phase}`);

    // ✅ Notify server that the player is now in "players-waiting"
    socket.emit("update_screen", { room: lobbyCode, screen: "players-waiting" });

    // ✅ Listen for user updates
    socket.on("update_users", (updatedUsers) => {
      console.log('👥 Updated Players List:', updatedUsers);
      setPlayers(updatedUsers.map(user => ({
        id: user.id,
        name: user.name, // ✅ Make sure this is set
        currentScreen: user.currentScreen || "unknown"
      })));      
    });

    if (phase === 'prompts') {
      socket.on('prompts_ready', () => {
        console.log("✅ Received 'prompts_ready' event. Moving to vote screen.");
        router.replace('/(game)/(play)/voting');
      });
    } else if (phase === 'story') {
      socket.on('story_ready', ({ prompt, story, round }) => {
        console.log(`✅ 'story_ready' received. Updating and navigating to ai-gen.tsx`);
        addPlotPoint({ winningPlotPoint: prompt, story });
    
        router.replace({
          pathname: '/(game)/(play)/ai-gen',
          params: {
            prompt,
            story,
            round: round.toString(),
          },
        });
      });
    
      // 👇 Optional: Handle early go_to_ai_gen if needed
      socket.on('go_to_ai_gen', ({ prompt }) => {
        router.replace({
          pathname: '/(game)/(play)/ai-gen',
          params: {
            prompt,
            story: "Loading...",
          },
        });
      });
    }
    

    return () => {
      console.log('🚪 Leaving Waiting Screen, updating server...');
      socket.emit("update_screen", { room: lobbyCode, screen: "unknown" }); // ✅ Move this ABOVE cleanup
      console.log('🧹 Cleaning up event listeners');
      socket.off('update_users');
      socket.off('prompts_ready');
      socket.off('story_ready');
      socket.off('go_to_ai_gen');
    };
  }, [lobbyCode, phase]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <GameBar
        onComplete={() => router.replace('/(game)/(play)/voting')}
        duration={30}
        initialRemainingTime={timeRemaining}
        isAbsolute={false}
      />
      <ScrollView className="flex-1 px-5 py-10" contentContainerStyle={{ flexGrow: 1, gap: 10 }}>
        {/* ✅ Display all players but change styles based on their screen */}
        {players.length > 0 ? (
          players.map((player) => {
            const isWaiting = player.currentScreen === "players-waiting"; // ✅ Check if player is on the waiting screen

            return isWaiting ? (
              // ✅ Players on waiting screen use ProfileDisplay for correct primary colors
              <ProfileDisplay 
                key={player.id} 
                username={player.name} 
                isVariant={true} 
              />
            ) : (
              // ✅ Players NOT on waiting screen get a black box with white text
              <View
                key={player.id}
                className="w-full flex flex-row items-center justify-between rounded-lg bg-black p-4"
              >
                <Text className="text-lg font-bold text-white">
                  {player.name}
                </Text>
              </View>
            );
          })
        ) : (
          <Text className="text-center text-xl font-bold text-backgroundText">Waiting for players...</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PlayersWaiting;
