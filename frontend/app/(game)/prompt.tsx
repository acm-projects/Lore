import { View, Text, TextInput } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "~/components/Button";
import { useLocalSearchParams, router } from "expo-router";
import { socket } from "../(main)/socket";

const Prompt = () => {
  const { lobbyCode } = useLocalSearchParams();
  const [prompt, setPrompt] = useState("");

  const submitPrompt = () => {
    if (prompt.trim() === "") return;
    
    socket.emit("submit_prompt", { room: lobbyCode, prompt });
    
    router.replace({
      pathname: "/(game)/waiting",
      params: { lobbyCode, phase: "prompts" },
    });    
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="mt-10 self-center">
        <Text className="text-3xl font-bold text-backgroundText">Enter Your Prompt:</Text>
      </View>
      <TextInput
        className="mx-5 mt-5 border rounded-lg p-3 text-backgroundText"
        placeholder="Write your prompt here..."
        placeholderTextColor="#999"
        value={prompt}
        onChangeText={setPrompt}
      />
      <View className="mx-5 mt-6">
        <Button title="Submit Prompt" bgVariant="primary" textVariant="primary" onPress={submitPrompt} />
      </View>
    </SafeAreaView>
  );
};

export default Prompt;
