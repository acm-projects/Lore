import { View, Text, ScrollView, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "~/components/Button";
import { useLocalSearchParams, router } from "expo-router";
import { socket } from "../(main)/socket";

const Story = () => {
  const { lobbyCode, prompt, story, finalRound, creator } = useLocalSearchParams();
  const [currentStory, setCurrentStory] = useState(story || "");
  const [winningPrompt, setWinningPrompt] = useState(prompt || "");
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    // Set creator status
    setIsCreator(socket.id === creator);

    // Listen for updated story event
    socket.on("story_ready", ({ story, prompt }) => {
      setCurrentStory(story);
      setWinningPrompt(prompt);
    });

    // Listen for global navigation to prompt.tsx
    socket.on("go_to_prompt", () => {
      router.replace({
        pathname: finalRound === "true" ? "/(main)/stories" : "/(game)/prompt",
        params: { lobbyCode },
      });
    });

    return () => {
      socket.off("story_ready");
      socket.off("go_to_prompt");
    };
  }, [lobbyCode, finalRound]);

  const handleNext = () => {
    if (finalRound === "true") {
      router.replace("/(main)/stories");
    } else {
      socket.emit("next_to_prompt", lobbyCode);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="mt-5 mx-5">
        <Text className="text-3xl font-bold text-backgroundText">Winning Prompt:</Text>
        <Text className="text-lg text-backgroundText">{winningPrompt}</Text>
      </View>

      <View className="flex-1 mx-5 mt-3">
        <Text className="text-xl font-bold text-backgroundText">Current Story:</Text>
        <TextInput
          value={currentStory}
          multiline
          editable={false}
          className="mt-3 p-5 border border-gray-400 rounded-lg bg-white"
          style={{ height: "70%", color: "black" }} // Makes text black & bigger textbox
        />
      </View>
      {isCreator && (
        <View className="mx-2 mb-2">
          <Button title="Next" bgVariant="primary" textVariant="primary" onPress={handleNext} />
        </View>
      )}
    </SafeAreaView>
  );
};

export default Story;
