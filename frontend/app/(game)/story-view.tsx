import {View, 
        Text, 
        TouchableOpacity, 
        ScrollView, 
        SafeAreaView, 
        Image,
        StatusBar } from 'react-native';
import { router } from 'expo-router';
import React from 'react';
import PlotPoint from '~/components/PlotPoint';
import components from "~/data/data.json";
import Button from '~/components/Button';

const StoryView = () => {

  return (
    <View className="flex-1">
      <Image className="w-full h-full" style={{resizeMode: 'cover', position: 'absolute'}} source={require("assets/bg2.gif")}/> 
      <View className="w-full h-[100px] bg-background justify-center items-center">
        <Button title="Go Back" bgVariant="primaryAccent" className="w-[80px]" onPress={() => {router.push("/(main)/home")}}></Button>
      </View>

      <ScrollView className="flex-1">
        <SafeAreaView>
            <View className="flex-col-reverse my-12">
              {components.map( (component) => (<PlotPoint 
                key={component.id}
                count={component.id}
                image={component.image}
                text={component.text} 
                />))}
            </View>
        </SafeAreaView>
      </ScrollView>
      
    </View>
  );
};

export default StoryView;
