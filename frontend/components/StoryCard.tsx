import React, { useEffect, useState } from 'react'
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
       
  function StoryCard(props: {count: any, text: string, story: string}) 
  {
    useFonts({'JetBrainsMonoRegular': require('assets/fonts/JetBrainsMonoRegular.ttf'), 
              'JetBrainsMonoBold': require('assets/fonts/JetBrainsMonoBold.ttf')
    });
    
    const fetchData = async () => {
    }

    useEffect(() => {
      fetchData()
    }, [])

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
                    {props.text}
                  </Text> 
                </View>
                <View className="h-1/3">
                  <Text adjustsFontSizeToFit numberOfLines={2} className="color-secondaryText" style={{fontSize: 10, fontFamily: "JetBrainsMonoRegular"}}>
                    {props.text}
                  </Text> 
                </View>
              <TouchableOpacity className="bg-primaryAccent w-1/2 h-1/3 rounded-lg justify-center items-center">
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