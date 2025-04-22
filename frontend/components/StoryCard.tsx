import React, { useEffect, useRef, useState } from 'react'
import { useFonts } from 'expo-font';
import data from "~/data/data.json";
import Collapsible from 'react-native-collapsible';
import { View,
         Text,
         ScrollView,
         SafeAreaView,
         Image,
         TouchableOpacity
       } from 'react-native'
import { BookOpen } from 'lucide-react-native';
import { router } from 'expo-router';
import { Audio } from 'expo-av';

  type WinnerInfo = {
    username: string;
    avatar: string;
  };
  type PlotPoint = {
    winningPlotPoint: string;
    story: string;
    winner?: WinnerInfo | null;
  };
  type SavedStory = {
    title: string;
    plotPoints: PlotPoint[];
  };
       
  function StoryCard(props: {count: any, title: string, story: SavedStory}) 
  {
    useFonts({'JetBrainsMonoRegular': require('assets/fonts/JetBrainsMonoRegular.ttf'), 
              'JetBrainsMonoBold': require('assets/fonts/JetBrainsMonoBold.ttf') });

    const soundRef = useRef<Audio.Sound | null>(null);
  
    const clickSFX = async () => {
      const { sound } = await Audio.Sound.createAsync(require('assets/click.mp3'));
      soundRef.current = sound;
      await sound.playAsync();
    };

    const openStory = (story: SavedStory) => {
      const serializedPlotPoints = story.plotPoints.map((point) => ({
        winningPlotPoint: point.winningPlotPoint,
        story: point.story,
        winner: point.winner || {
          username: "Unknown",
          avatar: "",
        },
      }));

      router.push({
        pathname: '../(game)/StoryView',
        params: {
          title: story.title,
          plotPoints: JSON.stringify(serializedPlotPoints),
        },
      });
    };

    return (
        <SafeAreaView className="flex-1">
          <View className={`items-center justify-center w-full h-full py-4`}>

            <View className="w-10/12 h-[150px] p-6 bg-backgroundSecondary flex flex-row">
              <View className="pt-2">
                <BookOpen size={30} color={'white'} className=""/>
              </View>
              <View className="h-full w-4/5 pl-4 ml-2 flex flex-col"> 
                <View className="h-1/3 mb-1">
                  <Text adjustsFontSizeToFit numberOfLines={2} className="color-white" style={{fontSize: 20, fontFamily: "JetBrainsMonoRegular"}}>
                    {props.title}
                  </Text> 
                </View>
                <View className="h-1/3">
                  <Text adjustsFontSizeToFit numberOfLines={2} className="color-secondaryText" style={{fontSize: 10, fontFamily: "JetBrainsMonoRegular"}}>
                    A Thrilling Tale Awaits!
                  </Text> 
                </View>
              <TouchableOpacity className="bg-primaryAccent w-1/2 h-1/3 rounded-lg justify-center items-center"
              onPress={() => {clickSFX(); openStory(props.story)}}>
                <Text style={{fontFamily: "JetBrainsMonoBold", fontSize: 12, color: 'white'}}>
                  View Story
                </Text>
              </TouchableOpacity>
              </View>
            </View>

          </View>
        </SafeAreaView>
    )
}

export default StoryCard