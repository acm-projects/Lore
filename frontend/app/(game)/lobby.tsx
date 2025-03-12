import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import Button from "~/components/Button";
import ProfileDisplay from "~/components/ProfileDisplay";
import { socket } from "../(main)/socket";

const Lobby = () => {
  const { lobbyCode } = useLocalSearchParams();
  const [players, setPlayers] = useState<{ id: string }[]>([]);
  const [creatorId, setCreatorId] = useState<string | null>(null);
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    if (!lobbyCode) {
      console.error("❌ lobbyCode is missing! Redirecting...");
      router.replace("/");
      return;
    }

    // Join the room and receive creatorId from the server
    socket.emit("join_room", { room: lobbyCode }, (response) => {
      if (!response.success) {
        console.error("❌ Failed to join room:", response.message);
        router.replace("/");
      } else {
        setCreatorId(response.creatorId); // Save creatorId from the server
        setIsCreator(response.creatorId === socket.id);
      }
    });

    socket.on("update_users", (users) => {
      console.log("👥 Updated Users List:", users);
      setPlayers(users || []);
    });

    socket.on("game_started", () => {
      console.log("🎮 Game Started! Navigating to prompt.tsx");
      router.replace(`/(game)/prompt?lobbyCode=${lobbyCode}`);
    });

    return () => {
      socket.off("update_users");
      socket.off("game_started");
    };
  }, [lobbyCode]);

  const startGame = () => {
    socket.emit("start_game", lobbyCode);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="mt-10 self-center">
        <Text className="text-3xl font-bold text-backgroundText">Join Code:</Text>
        <View className="mt-2 rounded-full bg-primary px-4 py-2">
          <Text className="text-center text-2xl font-bold text-primaryText">{lobbyCode || "Loading..."}</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-5 py-10">
        {players.length > 0 ? (
          players.map((player, index) => (
            <ProfileDisplay key={index} username={player.id.substring(0, 6)} />
          ))
        ) : (
          <Text className="text-center text-backgroundText">Waiting for players...</Text>
        )}
      </ScrollView>

      {isCreator && (
        <View className="mx-2 mb-2">
          <Button title="Start Game" bgVariant="primary" textVariant="primary" onPress={startGame} />
        </View>
      )}
    </SafeAreaView>
  );
};

export default Lobby;
