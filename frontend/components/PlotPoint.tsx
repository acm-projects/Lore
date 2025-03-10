import React, { useEffect, useState } from 'react'
import data from "~/data/data.json";
import { View,
         Text,
         ScrollView,
         SafeAreaView,
         Image,
         ImageBackground
       } from 'react-native'
import { Scroll } from 'lucide-react-native';

       
  function PlotPoint(props: {count: any, image: string, text: string }) {
    
    let [isArrayAtEnd, setEnd] = useState(false);

    const fetchData = async () => {
      if(props.count === data.length) {
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
          <View className="items-center justify-center">
            {!isArrayAtEnd && <View className="bg-primaryAccent w-[25px] h-[40px]" />}

            <View className="w-10/12 h-1/12 p-4 bg-backgroundSecondary flex flex-row rounded-lg">
              <Image source={require("assets/avatar2.png")} className="w-[50px] h-[50px]"/>
              <Text className="color-white ml-2" style={{flex: 1, flexWrap: 'wrap'}}>{props.text}</Text> 
            </View>
            

          </View>
        </SafeAreaView>
      </ScrollView>
    )
}

export default PlotPoint