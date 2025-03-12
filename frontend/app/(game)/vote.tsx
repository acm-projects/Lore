import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import Button from "~/components/Button";
import { socket } from "../(main)/socket";

const Vote = () => {
  const { lobbyCode } = useLocalSearchParams();
  const [prompts, setPrompts] = useState<{ prompt: string }[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);

  useEffect(() => {
    console.log("📡 Requesting prompts for voting...");
    socket.emit("request_prompts", { room: lobbyCode });

    socket.on("receive_prompts", (receivedPrompts) => {
      if (!Array.isArray(receivedPrompts)) {
        console.error("❌ Invalid prompts received:", receivedPrompts);
        return;
      }
      console.log("✅ Prompts received:", receivedPrompts);
      setPrompts(receivedPrompts);
    });

    return () => {
      socket.off("receive_prompts");
    };
  }, [lobbyCode]);

  const submitVote = () => {
    if (!selectedPrompt) return;
    console.log(`🗳 Submitting vote for: "${selectedPrompt}"`);
    socket.emit("submit_vote", { room: lobbyCode, votedPrompt: selectedPrompt });

    router.replace({
      pathname: "/(game)/waiting",
      params: { lobbyCode, phase: "story" },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="mt-10 self-center">
        <Text className="text-3xl font-bold text-backgroundText">Vote for a Prompt</Text>
      </View>
      <ScrollView className="flex-1 px-5 py-10">
        {prompts.map((promptObj, index) => (
          <TouchableOpacity key={index} onPress={() => setSelectedPrompt(promptObj.prompt)}>
            <View
              className={`p-4 mb-4 rounded-lg ${
                selectedPrompt === promptObj.prompt ? "bg-primary" : "bg-secondary"
              }`}>
              <Text className="text-lg font-bold text-black">{promptObj.prompt}</Text> {/* Ensuring Black Text */}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View className="mx-2 mb-2">
        <Button title="Submit Vote" bgVariant="primary" textVariant="primary" onPress={submitVote} />
      </View>
    </SafeAreaView>
  );
};

export default Vote;
