import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import PlotPoint from '~/components/PlotPoint';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

type PlotPointType = {
  winningPlotPoint: string;
  story: string;
};

const StoryView = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const title = params.title as string;
  const plotPoints = JSON.parse(params.plotPoints as string) as PlotPointType[];

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Back button */}
      <TouchableOpacity
        className="absolute left-4 top-4 z-10"
        onPress={() => router.back()}
      >
        <ArrowLeft size={28} color="white" />
      </TouchableOpacity>

      {/* Title */}
      <View className="mt-16 px-5">
        <Text className="text-3xl font-bold text-backgroundText mb-4 text-center">
          {title}
        </Text>
      </View>

      {/* Plot Points */}
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} className="px-5 pb-5">
        {plotPoints.map((point, index) => (
          <PlotPoint
            key={index}
            count={index}
            image="assets/avatar1.png"
            text={point.winningPlotPoint}
            story={point.story}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default StoryView;
