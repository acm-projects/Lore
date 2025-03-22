import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Modal from 'react-native-modal';
import StoryView from '~/components/story-view';
import { Pen, Settings, Undo2 } from 'lucide-react-native';
import Avatar from '~/components/Avatar';
import { View, Text, TouchableOpacity, Animated, Dimensions, Image, ScrollView } from 'react-native';
import { signOutUser } from 'app/(user_auth)/CognitoConfig.js'; // Import signOutUser from CognitoConfig.js

const Profile = () => {
  const animationValue = useRef(new Animated.Value(0)).current;
  let [isVisible, setVisible] = useState(false);

  const toggleVisible = () => {
    setVisible(!isVisible);
    Animated.timing(animationValue, {
      toValue: isVisible ? 0 : Dimensions.get('window').width,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // Handle Logout functionality
  const handleLogout = () => {
    signOutUser(); // Call signOutUser function to log the user out
    router.push('(user_auth)'); // Redirect to login page after logging out
  };

  return (
    <View className="flex-1 bg-background">
      <View className="w-full h-[250px] bg-backgroundSecondary items-start flex flex-col">
        <View className="pl-10 pt-12 w-full h-[80px] justify-between flex flex-row">
          <Text style={{ fontSize: 18 }} className="color-white">
            Profile
          </Text>
          <View className="flex flex-row justify-between w-[80px] pr-6">
            <Pen size={20} color={"white"} />
            <Settings size={20} color={"white"} />
          </View>
        </View>

        <View className="pl-4">
          <Avatar size={100} image={'https://picsum.photos/200/300'}></Avatar>
        </View>
      </View>

      <SafeAreaView>
        <View className="flex w-full h-1/3">
          <TouchableOpacity className="bg-primaryAccent w-[40px] h-[40px]" onPress={handleLogout}>
            <Text className="color-white">Log Out</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <View className="pl-4">
        <Modal isVisible={isVisible} animationIn="slideInLeft" animationOut="slideOutLeft">
          <View className="w-full h-[100px] bg-backgroundSecondary justify-between items-center flex flex-row pt-4">
            <View className="w-[50px] h-[40px] bg-primaryAccent rounded-r-lg justify-center items-center">
              <Undo2 color="white" onPress={() => toggleVisible()} />
            </View>
          </View>
          <StoryView code="43255"></StoryView>
        </Modal>
      </View>
    </View>
  );
};

export default Profile;
