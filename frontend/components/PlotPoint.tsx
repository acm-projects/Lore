import React, { useEffect, useState } from 'react'
import data from "~/data/data.json";
import { View,
         Text,
         ScrollView,
         SafeAreaView,
         Image,
         TouchableOpacity
       } from 'react-native'
import Collapsible from 'react-native-collapsible';
       
  function PlotPoint(props: {count: any, image: string, text: string, story: string}) 
  {
    let [isCollapsed, setCollapsed] = useState(true);
    let [isArrayAtEnd, setEnd] = useState(false);

    const fetchData = async () => {
      if(props.count === data.length) {
        setEnd(true)
      } else {
        setEnd(false)
      }
    }

    const toggleCollapsed = () => {
      setCollapsed(!isCollapsed);
    }

    useEffect(() => {
      fetchData()
    }, [])

    return (
      <ScrollView className="flex-1 flex-col-reverse">
        <SafeAreaView>
          <View className="items-center justify-center w-full">

            {!isArrayAtEnd && <View className="bg-primaryAccent w-[25px] h-[40px]" />}

            <TouchableOpacity className="w-10/12 h-1/12 p-4 bg-backgroundSecondary flex flex-row rounded-t-lg" onPress={() => {toggleCollapsed()}}>
              <Image source={require("assets/avatar2.png")} className="w-[50px] h-[50px]"/>
              <Text className="color-white ml-2" style={{flex: 1, flexWrap: 'wrap'}}>{props.text}</Text> 
            </TouchableOpacity>

            <Collapsible collapsed={isCollapsed}>
              <View className="bg-background w-[312px] h-auto rounded-b-lg">
                <Text className="color-white p-2" style={{flexWrap: 'wrap'}}> {props.story} </Text>
              </View>
            </Collapsible>

          </View>
        </SafeAreaView>
      </ScrollView>
    )
}

export default PlotPoint