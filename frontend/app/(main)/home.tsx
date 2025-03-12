import {View, 
        Image, 
        Text, 
        ScrollView, 
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
        <Image className="w-full h-full" style={{resizeMode: 'cover', position: 'absolute'}} source={require("assets/Homebg.png")} /> 
          <ScrollView className="">
            <SafeAreaView>
              <Button title='Story' bgVariant='primary' onPress={() => {router.push('/(game)/story-view')}} />
        </SafeAreaView>
        </ScrollView>
      </View>
         
    </TouchableWithoutFeedback>
  );
};



export default Home;
