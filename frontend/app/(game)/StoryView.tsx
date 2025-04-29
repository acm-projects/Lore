import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, Touchable } from 'react-native';
import React, { useEffect, useState } from 'react';
import PlotPoint from '~/components/PlotPoint';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFonts } from 'expo-font';

type PlotPointType = {
  winningPlotPoint: string;
  story: string;
};

const StoryView = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const title = params.title as string;
  const plotPoints = JSON.parse(params.plotPoints as string) as PlotPointType[];

  const [realPlotPoints, setPlotPoints] = useState<(PlotPointType)[]>([])

  const findUnique = () => {
    let uniquePlots: PlotPointType[] = []
    let realWinningPlots: string[] = []
    let realStory: string[] = []

    plotPoints.forEach(function(p) {realWinningPlots.push(p.winningPlotPoint)})
    plotPoints.forEach(function(p) {realStory.push(p.story)})
    realWinningPlots = [...new Set(realWinningPlots)]
    realStory.filter(story => story == "")

    for(let i = 0; i < plotPoints.length; i++) {
      const current = plotPoints[i]
      if(current?.story && current?.winningPlotPoint) {
        uniquePlots.push({
          story: realStory[i],
          winningPlotPoint: realWinningPlots[i]
        })
      }
    }
    uniquePlots.reverse()
    setPlotPoints(uniquePlots)
  }

  useEffect(() => {
    findUnique();
  }, [])

  useFonts({
    JetBrainsMonoRegular: require('assets/fonts/JetBrainsMonoRegular.ttf'),
    JetBrainsMonoBold: require('assets/fonts/JetBrainsMonoBold.ttf'),
  });

  return (
    <SafeAreaView className="flex-1 ">
      <Image className="w-full" style={{ resizeMode: 'cover', position: 'absolute', height: Dimensions.get("window").height}} source={require("assets/bg2.gif")}/> 

      {/* Back button */}
      <TouchableOpacity
        className="absolute left-4 top-10 z-10"
        onPress={() => router.back()}
      >
        <ArrowLeft size={28} color="white" />
      </TouchableOpacity>

      {/* Title */}
      <View className="mt-16 px-5">
        <Text className="text-3xl font-bold text-backgroundText mb-4 text-center"
              style={{fontFamily: 'JetBrainsMonoBold'}}>
          {title}
        </Text>
      </View>

      {/* Plot Points */}
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} className="px-5 pb-5">
        {realPlotPoints.map((point, index) => (
          <PlotPoint
            key={index}
            count={index}
            image="assets/avatar1.png"
            text={point?.winningPlotPoint}
            story={point?.story} username={''}/>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default StoryView;
