import {View, 
        Image, 
        Text, 
        ScrollView, 
        StatusBar,
        TouchableWithoutFeedback, 
        Keyboard } from 'react-native';
import React from 'react';
import {useIsFocused} from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '~/components/Button';
import { router } from 'expo-router';
import { FaceIcon,} from "@radix-ui/react-icons"

const Home = () => {
  const styles = require('../globalStyles') 

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}> 
      <View className="flex-1 bg-background">
        <StatusBar />
        <Image className="w-full h-full" style={{resizeMode: 'cover', position: 'absolute', opacity: .5}} source={require("assets/Homebg.png")} /> 
        <View className="w-full h-[150px] pt-4 bg-backgroundSecondary justify-between items-center">
          <Image 
              source={require("assets/Logo 1.png")}
              style={[{width: 300, height:150}, {resizeMode: "contain"}]}>
          </Image>
        </View>
        <ScrollView>
          <SafeAreaView>
            <Button title='Story' bgVariant='primary' onPress={() => {router.push('/(game)/story-view')}} />
         </SafeAreaView>
        </ScrollView>
      </View>   
    </TouchableWithoutFeedback>
  );
};



export default Home;
