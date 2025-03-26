import React, { createRef, useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import data from '~/data/data.json';
import AWS from 'aws-sdk';
import { useFonts } from 'expo-font';
import { useNavigation } from 'expo-router';
import { ArrowLeft, ArrowUp, BookOpen, Search, UsersRound } from 'lucide-react-native';
import StoryCard from '~/components/StoryCard';
import UserCard from '~/components/UserCard';
import Avatar from '~/components/Avatar';
import {View, 
        Text, 
        FlatList,
        TextInput,
        TouchableOpacity,
        ScrollView,
        useAnimatedValue,
        Dimensions,
        Animated,
        } from 'react-native';

  const s3 = new AWS.S3();
        
  const DATA = data.reverse();
  
  const otherUserProfile = () => {
    
    useFonts({
      'JetBrainsMonoRegular': require('assets/fonts/JetBrainsMonoRegular.ttf'),
    });
    
    /* ----------------------------------------- Animation ----------------------------------------------------------------- */
  const slideValue = useRef(useAnimatedValue((Dimensions.get("window").width))).current

  const slideOutAnimation = () => {
    Animated.timing(slideValue, {
      toValue: 0,
      duration: 400,
      useNativeDriver: false
    }).start()
  }

  const slideInAnimation = () => {
    Animated.timing(slideValue, {
      toValue: (Dimensions.get("window").width),
      duration: 200,
      useNativeDriver: false
    }).start()
  }
  /* ------------------------------------------------------------------------------------------------------------------- */

  // ----------------------------------- Scrolling Functionality -----------------------------------------------------------
  let flatListRef = createRef<FlatList<any>>()

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({offset: 0, animated: true})
  }

  const handleScroll = (event: any) => { // If user scrolls to around the top, get rid of the scroll to top button
    if (event.nativeEvent.contentOffset.y < 150 ) {
      slideInAnimation()
    } else {
      slideOutAnimation()
    }
  }
// ------------------------------------------------------------------------------------------------------------------------

  let [isStoryVisible, setStoryVisible] = useState(true)
  let [isFollowingVisible, setFollowingVisible] = useState(false)

  let [searchQuery, setSearchQuery] = useState("")
  let [filteredUsers, setFilteredUsers] = useState(data)

  const navigation = useNavigation()

  const handleSearch = (text: string) => {
    setSearchQuery(text)
    const filteredData = data.filter(name => name.name.toLowerCase().includes(text.toLowerCase()) )
    setFilteredUsers(filteredData)
  }


  return (
    <SafeAreaView className="bg-backgroundSecondary flex-1">
      <View className="w-full h-[60px] pl-4 flex flex-row">
        <View className="pt-6 flex flex-row flex-1">
        <ArrowLeft size={25} color={'white'} onPress={() => {navigation.goBack()}}/>
        <Text style={{fontSize: 18, fontFamily: 'JetBrainsMonoRegular'}} className="color-white"> Profile </Text>
        </View>
      </View>

      <FlatList 
        ref={flatListRef}
        onScroll={handleScroll}
        className="bg-background"
        data={searchQuery === "" ? DATA : filteredUsers}
        renderItem={({item, index}) => isStoryVisible ? <StoryCard              
                                                        key={index}
                                                        count={index}
                                                        text={item.text}
                                                        story={item.aiPrompt}/> 
                                                      : (
                   isFollowingVisible && item.friends ? 
                                                        <UserCard 
                                                          key={index}
                                                          name={item.name}
                                                          image={item.image}
                                                          friends={item.friends}/>
                                                      : <View />)
        }
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        ListHeaderComponent={
          // -----------------------------------   Header Component -----------------------------------------------
          <View className="w-full bg-backgroundSecondary items-start flex flex-col" style={isFollowingVisible ? {marginTop: -500, height: 806} 
                                                                                                                : {marginTop: -500, height: 720}}>
            <View className="pt-[500px]">
              <View className="w-2/3 flex-2 pl-4 flex flex-row items-center">
                <Avatar size={100} image={'https://picsum.photos/200/300'}></Avatar>
                <View className="h-[100px] px-2">
                  <Text style={{fontSize: 18, fontFamily: 'JetBrainsMonoRegular'}} className="color-white">Username</Text>
                  <Text numberOfLines={4} style={{fontSize: 14, fontFamily: 'JetBrainsMonoRegular'}} className="pb-8 color-secondaryText">Bio</Text>
                </View>
              </View>

              <View className="px-16 w-full flex-1 flex-row justify-between items-center">
                <View className="mt-10 justify-center items-center">
                  <Text style={{fontSize: 18, fontFamily: 'JetBrainsMonoRegular'}} className="color-white">Stories</Text>
                  <Text style={{fontSize: 14, fontFamily: 'JetBrainsMonoRegular'}} className="pb-8 color-secondaryText">Story Count</Text>
                </View>
                <View className="mt-10 justify-center items-center">
                  <Text style={{fontSize: 18, fontFamily: 'JetBrainsMonoRegular'}} className="color-white">Friends</Text>
                  <Text style={{fontSize: 14, fontFamily: 'JetBrainsMonoRegular'}} className="pb-8 color-secondaryText">Friend Count</Text>
                </View>
              </View>

              <View className="flex-1 px-10">
                <View className="pt-6 px-20 w-full h-full justify-between flex flex-row">
                  <BookOpen size={30} color={isStoryVisible ? '#06D6A1' : 'white'} onPress={() => {setSearchQuery(""); setStoryVisible(true); setFollowingVisible(false)}}/>
                  <UsersRound size={30} color={isFollowingVisible ? '#06D6A1' : 'white'} onPress={() => {setSearchQuery(""); setStoryVisible(false); setFollowingVisible(true)}}/>
                </View>
              </View>
              
              <View className="w-full px-[105px] justify-between flex flex-row">
                {isStoryVisible ? <View className="bg-primaryAccent w-[30px] h-[2px]"/> : <View />}
                {isFollowingVisible ? <View className="bg-primaryAccent w-[30px] h-[2px]"/> : <View/>}
              </View> 

              {/* Note that this is just pretending to be apart of the friends section, it's actually apart of the darker section on top of it, so if there's any formatting issues change the height of that*/}
              <View className="bg-background items-center justify-center"> 
              {isFollowingVisible ?   
                                  <View>
                                    <View className="flex flex-row mt-4 mb-4 items-center"> 
                                      <TextInput 
                                        className="bg-backgroundSecondary color-white h-[40px] w-[330px] rounded-xl px-10"
                                        placeholder = "Search Users"
                                        value={searchQuery}
                                        onChangeText={handleSearch}/> 
                                      <View className="pl-2" style={{position: 'absolute'}}>
                                        <Search size={20} color='#313338' />
                                      </View>
                                    </View>
                                    <Text className="color-secondaryText" style={{fontFamily: 'JetBrainsMonoRegular'}}>Friends</Text>
                                  </View>
                                  : <View />}
              </View>
            </View>
          </View>}>
        {/* --------------------------------------------------------------------------------------------------- */}
      </FlatList>

    {/*--------------------------------------------- Scroll to Top Button ----------------------------------------*/}
    <Animated.View style={{position: 'absolute', marginTop: 585, marginLeft: 320, transform: [{translateX: slideValue}]}}>
      <TouchableOpacity className="bg-primaryAccent h-[45px] w-[45px] rounded-full items-end"   
                      onPress={() => {scrollToTop()}}>
        <View className="flex-1 items-center justify-center pr-2">
          <ArrowUp size={30} color={'white'}></ArrowUp>
        </View> 
      </TouchableOpacity>
    </Animated.View>
    {/* ----------------------------------------------------------------------------------------------------------- */}
    </SafeAreaView>
  );
};

export default otherUserProfile;


