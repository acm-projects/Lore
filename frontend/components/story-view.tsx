import {View, 
        Text, 
        ScrollView, 
        SafeAreaView, 
        Image,
        Animated,
        Easing } from 'react-native';
import { router } from 'expo-router';
import React, { useRef, useEffect } from 'react';
import PlotPoint from '~/components/PlotPoint';
import components from "~/data/data.json";
import { BookOpen, Undo2, ChevronDown } from 'lucide-react-native';

const StoryView = (props: {code: String}) => {
  const bounceValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([Animated.timing(bounceValue, {
        toValue: 5,
        duration: 650,
        easing: Easing.ease,
        useNativeDriver: true, }),  

      Animated.timing(bounceValue, {
        toValue: 0,
        duration: 650,
        easing: Easing.ease,
        useNativeDriver: true, }),
      ])
    ).start();
  }, [bounceValue])

  return (
    <View className="flex-1">
       <Image className="w-full h-full" style={{resizeMode: 'cover', position: 'absolute'}} source={require("assets/bg2.gif")}/> 


      <ScrollView className="flex-1">
        <SafeAreaView>
          <Animated.View style={{ transform: [{translateY: bounceValue}]}} className="pb-2 pt-12 pl-10 flex flex-row">  
              <ChevronDown color="white"/>
              <Text className="color-white"> Latest Plot Point </Text>
          </Animated.View>
          <View className="flex-col-reverse mb-12">

            {components.map( (component) => (<PlotPoint 
              key={component.id}
              count={component.id}
              image={component.image}
              text={component.text} 
              story={component.aiPrompt}
            />))}
          </View>
        </SafeAreaView>
      </ScrollView>
      
    </View>
  );
};

export default StoryView;
