import { View, Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '~/components/Button';

const Stories = () => {
  return (
    <SafeAreaView className="bg-background flex-1">
      <View className="mx-3 flex flex-1 justify-between">
        <Text className="text-backgroundText text-2xl font-bold">Story History</Text>
        <View className="flex w-full flex-row gap-x-3">
          <Button
            title="Create Story"
            bgVariant="secondary"
            textVariant="secondary"
            className="flex-1"
          />
          <Button title="Join Story" bgVariant="primary" textVariant="primary" className="flex-1" />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Stories;
