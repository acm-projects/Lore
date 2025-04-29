import React, { useEffect, useRef, useState } from 'react'
import data from "~/data/data.json";
import Collapsible from 'react-native-collapsible';
import { View,
         Text,
         ScrollView,
         SafeAreaView,
         Image,
         TouchableOpacity
       } from 'react-native'
import Avatar from './Avatar';
import { useLobby } from '~/context/LobbyContext';
import { useFonts } from 'expo-font';
import { Audio } from 'expo-av';
import { useAudio } from '~/context/AudioContext';
       
function PlotPoint(props: { 
    count: number; 
    image: string;         // winner's avatar URL
    username: string;      // winner's username
    text: string;          // winning prompt
    story: string;         // AI-generated story
})   
  {
    let [isCollapsed, setCollapsed] = useState(true);
    let [isArrayAtEnd, setEnd] = useState(false);
    const { plotPoints } = useLobby()

    const toggleCollapsed = () => {
      setCollapsed(!isCollapsed);
    }
    
    const fetchData = async () => {
      if(props.count === plotPoints.length-1) { /* Replace data with actual database */
        setEnd(false)
      } else {
        setEnd(true)
      }
    }

    useEffect(() => {
      console.log(props.count + " " + plotPoints.length)
      fetchData()
    }, [])

    //SFX
    const { playSound, stopSound, isMuted, toggleMute } = useAudio();
    const soundRef = useRef<Audio.Sound | null>(null);
    const clickSFX = async () => {
      const { sound } = await Audio. Sound.createAsync(
        require('assets/click.mp3'),
      );
      soundRef.current = sound;
      await sound.playAsync()
    }

    useFonts({
      'JetBrainsMonoRegular': require('assets/fonts/JetBrainsMonoRegular.ttf'),
      'JetBrainsMonoBold': require('assets/fonts/JetBrainsMonoBold.ttf'),
    });

    return (
      <ScrollView className="flex-1 flex-col-reverse py-4">
        <SafeAreaView>
          <View className="items-center justify-center w-full">

            {/* isArrayAtEnd && <View className="bg-primaryAccent w-[25px] h-[40px]" /> */}

            <TouchableOpacity className="w-10/12 h-1/12 p-4 bg-background flex flex-row rounded-t-lg"               
                                        /*style={isArrayAtEnd ? 
                                        {borderColor: "#06D6A1", borderWidth: 2, shadowColor: "#06D6A1", shadowOpacity: 3, shadowRadius: 3, shadowOffset: {width:0, height: 4}} : {}}*/                                                
                                        onPress={() => {clickSFX(); toggleCollapsed()}}>
              <Avatar size={40} image={props.image} />
              <Text className="color-white ml-2" style={{fontFamily: 'JetBrainsMonoRegular', flex: 1, flexWrap: 'wrap'}}> 
                {props.username}: {props.text}
              </Text>
            </TouchableOpacity>

            <Collapsible collapsed={isCollapsed} style={{width: '83.33333%' }}>
              <View className="bg-backgroundSecondary h-auto rounded-b-lg">
                <Text className="color-white p-2" style={{flexWrap: 'wrap'}}> {props.story} </Text>
              </View>
            </Collapsible>

          </View>
        </SafeAreaView>
      </ScrollView>
    )
}

export default PlotPoint