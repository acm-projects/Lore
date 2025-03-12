import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { socket } from "../(main)/socket";

const Waiting = () => {
  const { lobbyCode, phase } = useLocalSearchParams(); // Phase determines what we are waiting for
  const [waitingText, setWaitingText] = useState("Waiting...");

  useEffect(() => {
    console.log(`🚀 Waiting Screen Loaded | Phase: ${phase}`);

    if (phase === "prompts") {
      setWaitingText("Waiting for all players to submit their prompts...");
      
      socket.on("prompts_ready", () => {
        console.log("✅ Received 'prompts_ready' event. Moving to vote screen.");
        router.replace(`/(game)/vote?lobbyCode=${lobbyCode}`);
      });

    } else if (phase === "story") {
      setWaitingText("Waiting for AI to generate the story...");

      socket.on("story_ready", ({ prompt, story, finalRound }) => {
        console.log("✅ Received 'story_ready' event. Moving to story screen.");
        
        router.replace({
          pathname: "/(game)/story",
          params: { lobbyCode, prompt, story, finalRound },
        });
      });

    }

    // Cleanup event listeners when unmounting or re-rendering
    return () => {
      console.log("🧹 Cleaning up event listeners");
      socket.off("prompts_ready");
      socket.off("story_ready");
    };
  }, [lobbyCode, phase]);

  return (
    <SafeAreaView className="flex-1 bg-background justify-center items-center">
      <Text className="text-2xl text-backgroundText">{waitingText}</Text>
      <ActivityIndicator size="large" color="#FFFFFF" />
    </SafeAreaView>
  );
};

export default Waiting;
