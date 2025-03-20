import { View, Text, ScrollView, Image, Dimensions } from 'react-native';
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

  const [players, setPlayers] = useState<{ id: string, currentScreen: string }[]>([]);

  useEffect(() => {
    console.log(`🚀 Waiting Screen Loaded | Phase: ${phase}`);

    // ✅ Tell the server the player is now in the "waiting" screen
    socket.emit("update_screen", { room: lobbyCode, screen: "waiting" });

    // ✅ Listen for user updates
    socket.on("update_users", (updatedUsers) => {
      console.log('👥 Updated Players List:', updatedUsers);

      // ✅ Filter only players who are currently in the waiting screen
      const waitingPlayers = updatedUsers.filter(user => user.currentScreen === "waiting");
      setPlayers(waitingPlayers);
    });

    if (phase === 'prompts') {
      socket.on('prompts_ready', () => {
        console.log("✅ Received 'prompts_ready' event. Moving to vote screen.");
        router.replace('/(game)/(play)/voting');
      });
    } else if (phase === 'story') {
      socket.on('story_ready', ({ prompt, story, round }) => {
        console.log(`✅ Received 'story_ready' event. Moving to story screen (Round: ${round}).`);

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
    }

    return () => {
      console.log('🧹 Cleaning up event listeners');
      socket.off('update_users');
      socket.off('prompts_ready');
      socket.off('story_ready');
    };
  }, [lobbyCode, phase]);

  return (
    <SafeAreaView className="flex-1 bg-background">
        <Image className="w-full" style={{resizeMode: 'cover', position: 'absolute', height: Dimensions.get("window").height}} source={require("assets/bg2.gif")}/> 
      
      <GameBar
        onComplete={() => router.replace('/(game)/(play)/voting')}
        duration={30}
        initialRemainingTime={timeRemaining}
        isAbsolute={false}
      />
      <ScrollView className="flex-1 px-5 py-10" contentContainerStyle={{ flexGrow: 1, gap: 10 }}>
        {/* ✅ Dynamically display only players in "waiting" */}
        {players.length > 0 ? (
          players.map((player, index) => (
            <ProfileDisplay key={player.id} username={`Player ${index + 1}: ${player.id}`} isVariant={index % 2 === 0} />
          ))
        ) : (
          <Text className="text-center text-xl font-bold text-backgroundText">Waiting for players...</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PlayersWaiting;
