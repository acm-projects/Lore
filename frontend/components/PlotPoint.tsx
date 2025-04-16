import React, { useEffect, useState } from 'react'
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

    const toggleCollapsed = () => {
      setCollapsed(!isCollapsed);
    }
    
    const fetchData = async () => {
      if(props.count === data.length) { /* Replace data with actual database */
        setEnd(true)
      } else {
        setEnd(false)
      }
    }

    useEffect(() => {
      fetchData()
    }, [])

    return (
      <ScrollView className="flex-1 flex-col-reverse">
        <SafeAreaView>
          <View className="items-center justify-center w-full">

            {isArrayAtEnd && <View className="bg-primaryAccent w-[25px] h-[40px]" />}

            <TouchableOpacity className="w-10/12 h-1/12 p-4 bg-background flex flex-row rounded-t-lg"               
                                        /*style={isArrayAtEnd ? 
                                        {borderColor: "#06D6A1", borderWidth: 2, shadowColor: "#06D6A1", shadowOpacity: 3, shadowRadius: 3, shadowOffset: {width:0, height: 4}} : {}}*/                                                
                                        onPress={() => {toggleCollapsed()}}>
              <Avatar size={40} image={props.image} />
              <Text className="color-white ml-2" style={{flex: 1, flexWrap: 'wrap'}}> 
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