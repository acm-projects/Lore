import React, { createRef, useCallback, useEffect, useRef, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import data from '~/data/data.json'
import { useFonts } from 'expo-font';
import Modal from 'react-native-modal';
import { ArrowUp, BookOpen, LogOut, Pen, Search, Settings , UserRoundPlus, UsersRound, X } from 'lucide-react-native';
import StoryCard from '~/components/StoryCard';
import UserCard from '~/components/UserCard';
import Avatar from '~/components/Avatar';
import * as ImagePicker from 'expo-image-picker';
import { signOutUser, getUserAttributes } from 'app/(user_auth)/CognitoConfig.js'; // Import signOutUser from CognitoConfig.js
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
import AWS from 'aws-sdk';
        
const DATA = data.reverse();
        
  const Profile = () => {
    AWS.config.update({
      //accessKeyId: 'AKIAQQABDJ7GWG7CMXGN',
      //secretAccessKey: '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',
      region: 'us-east-2',
    });

    const s3 = new AWS.S3()
    const dynamodb = new AWS.DynamoDB.DocumentClient()
    const [username, setUsername] = useState("")
    const [friends, setFriends] = useState([])
    const [avatar, setAvatar] = useState("")
    const [bio, setBio] = useState("")
    const [stories, setStories] = useState([])

    const getUsername = async () => { // Get username from Cognito Config in order to get primary key
      setUsername(await getUserAttributes())
    }

    useFocusEffect(useCallback(() => {
      getUsername()
      getItems()
    }, []))

    useFonts({
      'JetBrainsMonoRegular': require('assets/fonts/JetBrainsMonoRegular.ttf'),
    });

    const params = {
      TableName: 'Players',
      IndexName: 'Username-index',
      KeyConditionExpression: 'Username = :usernameValue',
      ProjectionExpression: "Username, Email, Friends, ProfilePicURL, Stories",
      ExpressionAttributeValues: {
        ':usernameValue': username
      }
    }
  
    const getItems = async () => {
      dynamodb.query(params, (err, data) => {
        if (err) {
          console.log('' + err)
        } else {
          data.Items?.forEach(item => {
            setUsername(item.Username)
            setAvatar(item.ProfilePicURL)
            setBio(item.Biography)
            //setStories(item.StoriesParticipated)
            //setFriends(item.Friends)
          })

        }
      })
    }

    // ------------------------------------------- Profile Pictures Picking --------------------------------------------------------
    const [image, setImage] = useState<string>("")
    
    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1
      })

      if(!result.canceled) {
        setImage(result.assets[0].uri)
      } 
      console.log(image)
      uploadImageToS3(image, "new")
    }

    const uploadImageToS3 = async (imageUri: string, imageName: string) => {
      const response = await fetch(imageUri)
      const blob = await response.blob()

      const params = {
        Bucket: 'loreprofilepictures',
        Key: `profile-pictures/${imageName}`,
        Body: blob,
        ContentType: "image/jpeg",
        ACL: 'public-read'
      }

      try{
        const result = await s3.upload(params).promise()
        return result.Location

      } catch (error) {
        console.error('Error uploading image:', error)
        throw error
      }

    }
  /* ------------------------------------------------------------------------------------------------------------------- */

    
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
  let [isSearchVisible, setSearchVisible] = useState(false)
  let [isEditVisible, setEditVisible] = useState(false)

  let [searchQuery, setSearchQuery] = useState("")
  let [filteredUsers, setFilteredUsers] = useState(data)

  const handleSearch = (text: string) => {
    setSearchQuery(text)
    const filteredData = data.filter(name => name.name.toLowerCase().includes(text.toLowerCase()) )
    setFilteredUsers(filteredData)
  }

  // Handle Logout functionality
  const handleLogout = () => {
    signOutUser(); // Call signOutUser function to log the user out
    router.push('/'); // Redirect to login page after logging out
  };

  return (
    <SafeAreaView className="bg-backgroundSecondary flex-1">
      <View className="w-full h-[60px] pl-4 justify-between flex flex-row">
        <Text style={{fontSize: 18, fontFamily: 'JetBrainsMonoRegular'}} className="color-white pt-6"> Profile </Text>
        <View className="flex flex-row justify-between w-[80px] pr-6 pt-6">
          <Pen size={20} color={"white"} onPress={() => {setEditVisible(true)}}/>
          <LogOut size={20} color={"red"} onPress={() => {handleLogout()}}/>
        </View>
      </View>

      {/*----------------------------------------------- EDITING PROFILE --------------------------------------*/}
      <SafeAreaView className="flex-1">
      <Modal animationIn={"slideInRight"} animationOut={"slideOutRight"} className="flex-1 bg-background" style={{marginHorizontal: 0, marginBottom: 0}} isVisible={isEditVisible}>
        <View className="bg-background flex-1 p-4">
        <ScrollView className="flex-1" automaticallyAdjustKeyboardInsets={true} stickyHeaderIndices={[0]}>
          
          <View className="w-full h-[40px] flex-row justify-between bg-background">
            <Text style={{fontFamily: 'JetBrainsMonoRegular', fontSize: 20, color: 'white'}}>Edit Profile</Text>
            <X color={"white"} onPress={() => {setEditVisible(false)}}/>
          </View>
          
          <View className="flex flex-col flex-1 items-start">
            <Text style={{color: 'white', fontFamily: 'JetBrainsMonoRegular', fontSize: 16, paddingBottom: 10}}>Avatar</Text>
            <View className="pl-4 flex flex-row items-center justify-between">
              <Avatar size={100} image={avatar}></Avatar>
              <TouchableOpacity className="bg-primaryAccent w-[110px] h-[40px] justify-center items-center rounded-xl ml-6"
                                onPress={() => {pickImage()}}>
                <Text style={{fontFamily: 'JetBrainsMonoBold', color: "white"}}> Edit Avatar </Text>
              </TouchableOpacity>
            </View>
            <View className="bg-secondaryText h-[1px] w-full my-6"></View>

            <View className="flex flex-col items-center">
              <View className="items-start">
                <Text style={{fontSize: 18, fontFamily: 'JetBrainsMonoRegular'}} className="color-white pb-4">Username</Text>
                <TextInput 
                  className="bg-backgroundSecondary color-white h-[40px] w-[330px] rounded-xl px-2"
                  placeholder = ""
                  /> 
              </View>
              <TouchableOpacity className="bg-primaryAccent w-[110px] h-[40px] justify-center items-center rounded-xl mt-4">
                <Text style={{fontFamily: 'JetBrainsMonoBold', color: "white"}}> Change Username </Text>
              </TouchableOpacity>
            </View>
            <View className="bg-secondaryText h-[1px] w-full my-6"></View>

            <View className="flex flex-col items-center">
              <View className="items-start">
                <Text style={{fontSize: 18, fontFamily: 'JetBrainsMonoRegular'}} className="color-white pb-4">Bio</Text>
                <TextInput 
                  className="bg-backgroundSecondary color-white h-[100px] w-[330px] rounded-xl px-2"
                  placeholder = ""
                  /> 
              </View>
              <TouchableOpacity className="bg-primaryAccent w-[110px] h-[40px] justify-center items-center rounded-xl mt-4"
                                onPress={() => {getItems()}}>
                <Text style={{fontFamily: 'JetBrainsMonoBold', color: "white"}}> Change Username </Text>
              </TouchableOpacity>
            </View>
            <View className="bg-secondaryText h-[1px] w-full my-6"></View>

          </View>
        </ScrollView>
        </View>
      </Modal>
      </SafeAreaView>
      {/*---------------------------------------------------------------------------------------------------------*/}

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
                                                      : (
                     isSearchVisible && !item.friends ? 
                                                        <UserCard 
                                                          key={index}
                                                          name={item.name}
                                                          image={item.image}
                                                          friends={item.friends}/> 
                                                      : <View />
                                                        )
        )}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        ListHeaderComponent={
  // ------------------------------------------------------   Header Component -----------------------------------------------
          <View className="w-full bg-backgroundSecondary items-start flex flex-col" style={isFollowingVisible || isSearchVisible ? {marginTop: -500, height: 806} 
                                                                                                                : {marginTop: -500, height: 720}}>
            <View className="pt-[500px]">
              <View className="w-2/3 flex-2 pl-4 flex flex-row items-center">
                <Avatar size={100} image={avatar}></Avatar>
                <View className="h-[100px] px-2">
                  <Text style={{fontSize: 18, fontFamily: 'JetBrainsMonoRegular'}} className="color-white">{username}</Text>
                  <Text numberOfLines={4} style={{fontSize: 14, fontFamily: 'JetBrainsMonoRegular'}} className="pb-8 color-secondaryText">{bio}</Text>
                </View>
              </View>

              <View className="px-16 w-full flex-1 flex-row justify-between items-center">
                <View className="mt-10 justify-center items-center">
                  <Text style={{fontSize: 18, fontFamily: 'JetBrainsMonoRegular'}} className="color-white">Stories</Text>
                  <Text style={{fontSize: 14, fontFamily: 'JetBrainsMonoRegular'}} className="pb-8 color-secondaryText">{stories.length}</Text>
                </View>
                <View className="mt-10 justify-center items-center">
                  <Text style={{fontSize: 18, fontFamily: 'JetBrainsMonoRegular'}} className="color-white">Friends</Text>
                  <Text style={{fontSize: 14, fontFamily: 'JetBrainsMonoRegular'}} className="pb-8 color-secondaryText">{friends.length}</Text>
                </View>
              </View>

              <View className="flex-1 px-10">
                <View className="pt-6 w-full h-full justify-between flex flex-row">
                  <BookOpen size={30} color={isStoryVisible ? '#06D6A1' : 'white'} onPress={() => {setSearchQuery(""); setStoryVisible(true); setFollowingVisible(false); setSearchVisible(false)}}/>
                  <UsersRound size={30} color={isFollowingVisible ? '#06D6A1' : 'white'} onPress={() => {setSearchQuery(""); setStoryVisible(false); setFollowingVisible(true); setSearchVisible(false)}}/>
                  <UserRoundPlus size={30} color={isSearchVisible ? '#06D6A1' : 'white'} onPress={() => {setSearchQuery(""); setStoryVisible(false); setFollowingVisible(false); setSearchVisible(true)}}/>
                </View>
              </View>
              
              <View className="w-full px-10 justify-between flex flex-row">
                {isStoryVisible ? <View className="bg-primaryAccent w-[30px] h-[2px]"/> : <View />}
                {isFollowingVisible ? <View className="bg-primaryAccent w-[30px] h-[2px]"/> : <View/>}
                {isSearchVisible ? <View className="bg-primaryAccent w-[30px] h-[2px]"/>: <View/>}
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
              {isSearchVisible ?
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
                                  <Text className="color-secondaryText" style={{fontFamily: 'JetBrainsMonoRegular'}}>Users</Text>
                                </View>
                                : <View />}
              </View>
            </View>
          </View>}>
        {/* --------------------------------------------------------------------------------------------------- */}
      </FlatList>

    {/*--------------------------------------------- Scroll to Top Button ----------------------------------------*/}
    <Animated.View style={{position: 'absolute', marginTop: 555, marginLeft: 320, transform: [{translateX: slideValue}]}}>
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

export default Profile;
