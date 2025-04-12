import React, { createRef, useCallback, useEffect, useRef, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import data from '~/data/data.json'
import { useFonts } from 'expo-font';
import Modal from 'react-native-modal';
import { ALargeSmall, ArrowUp, BookOpen, IdCard, LogOut, Pen, Search, UserRoundPlus, UsersRound, X } from 'lucide-react-native';
import StoryCard from '~/components/StoryCard';
import UserCard from '~/components/UserCard';
import Avatar from '~/components/Avatar';
import * as ImagePicker from 'expo-image-picker';
import { signOutUser, getUserAttributes, getUserCognitoSub } from 'app/(user_auth)/CognitoConfig.js'; // Import signOutUser from CognitoConfig.js
import {View, 
        Text, 
        FlatList,
        TextInput,
        TouchableOpacity,
        ScrollView,
        useAnimatedValue,
        Dimensions,
        Animated,
        Image,
        Keyboard,
        KeyboardAvoidingView,
        Alert,
        ActivityIndicator
        } from 'react-native';
import AWS, { DynamoDB } from 'aws-sdk';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const Stories = () => {
  const [stories, setStories] = useState<SavedStory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStories = async () => {
    try {
      const user = await getUserAttributes();
      const res = await fetch(
        `http://localhost:3001/get-stories?userId=${user.username}`
      );
      const json = await res.json();
      setStories(json.stories || []);
    } catch (err) {
      console.error('Failed to fetch stories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const openStory = (story: SavedStory) => {
    router.push({
      pathname: '../(game)/StoryView',
      params: {
        title: story.title,
        plotPoints: JSON.stringify(story.plotPoints),
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="mx-3 flex flex-1 justify-between">
        <Text className="mb-4 text-2xl font-bold text-backgroundText">Story History</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#ffffff" />
        ) : (
          <ScrollView className="flex-1 space-y-3">
            {stories.map((story, idx) => (
              <TouchableOpacity
                key={idx}
                className="rounded-lg bg-secondary p-4"
                onPress={() => openStory(story)}>
                <Text className="text-lg font-semibold text-white">{story.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};
  const Profile = () => {
    useFonts({
      'JetBrainsMonoRegular': require('assets/fonts/JetBrainsMonoRegular.ttf'),
    });

    AWS.config.update({
    });

    const s3 = new AWS.S3()
    const dynamodb = new AWS.DynamoDB.DocumentClient()

    // ------------------------------------------- Logged On User Details --------------------------------------------------------
    const [username, setUsername] = useState("")
    const [cognitoSub, setCognitoSub] = useState("")
    const [primaryKey, setPrimaryKey] = useState(0)
    const [avatar, setAvatar] = useState("")
    const [stories, setStories] = useState([])
    const [isGuest, setGuest] = useState(false)
    //const [friends, setFriends] = useState([])
    //const [bio, setBio] = useState("")

    const getCognitoSub = async () => {
      const sub = await getUserCognitoSub();
      if (typeof sub === 'string') {
        setCognitoSub(sub);
      } else {
        console.warn("⚠️ Invalid Cognito Sub:", sub);
      }
    };    

    useFocusEffect(useCallback(() => { // Run these functions whenever profile page is loaded
      getCognitoSub()
      getItems()
      if(cognitoSub.length === 0) {
        setGuest(true)
      }
    }, []))

    useEffect(() => {
      if (typeof cognitoSub === 'string' && cognitoSub.length !== 0) {
        setGuest(false);
      }
      getItems();
    }, [cognitoSub]);    

    const queryParams = {
      TableName: 'Players',
      IndexName: 'CognitoSub-index',
      KeyConditionExpression: 'CognitoSub = :subValue',
      ProjectionExpression: "Username, Email, Friends, ProfilePicURL, Stories, PlayerID, Biography",
      ExpressionAttributeValues: {
        ':subValue': cognitoSub
      }
    }
  
    const getItems = async () => {
      dynamodb.query(queryParams, (err, data) => {
        if (err) {
          console.log('' + err)
        } else {
          data.Items?.forEach(item => {
            setUsername(item.Username)
            setAvatar(item.ProfilePicURL)
            setPrimaryKey(item.PlayerID)
            //setBio(item.Biography)
            //setStories(item.StoriesParticipated)
            //setFriends(item.Friends)
          })

        }
      })
    }

    // ------------------------------------------- Get other Users --------------------------------------------------------
    type user = {Biography: string, CognitoSub: string, CreatedAt: string, Email: string, Friends: {}, PlayerID: number, Stories: number, StoriesParticipated: {}, Username: string}
    const [otherUsers, setOtherUsers] = useState<user[]>([])
    
    const scanItems = async () => {

      const items = await dynamodb.scan({ TableName: 'Players' }).promise();
      
      setOtherUsers(items.Items as user[] || [])
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
      uploadImageToS3(image, ""+primaryKey)
    }

    // ------------------------------------------- Uploading to S3 Bucket + Updating Profile Picture --------------------------------------------------------
    const uploadImageToS3 = async (imageUri: string, imageName: string) => {

      const params = {
        Bucket: 'loreprofilepictures',
        Key: `profile-pictures/${imageName}`,
        Body: await fetch(imageUri).then(res => res.blob()),
        ContentType: "image/jpeg",
        ACL: 'public-read'
      }

      try {
        const uploadResult = await s3.upload(params).promise();
        setAvatar(imageUri)
        const dbParams = {
          TableName: 'Players',
          Key: {PlayerID: primaryKey},
          UpdateExpression: 'SET ProfilePicURL = :url',
          ExpressionAttributeValues: {
            ':url': uploadResult.Location
          }
        };
        await dynamodb.update(dbParams).promise();
        console.log('Profile picture updated successfully!');

      } catch (error) {
        console.error('Error uploading profile picture:', error);
      }  

    }
    // ------------------------------------------------------------Updating Username --------------------------------------------------------------- */
    const [newName, setNewName] = useState("")

    const updateUsername = async (newUsername: string) => {

      try {
        setUsername(newUsername) // Set the original username to function username parameter
        setNewName("")
        const dbParams = {
          TableName: 'Players',
          Key: {PlayerID: primaryKey},
          UpdateExpression: 'SET Username = :username',
          ExpressionAttributeValues: {
            ':username': newUsername
          }
        }
        await dynamodb.update(dbParams).promise();

        console.log('Username updated successfully!');

      } catch (error) {
        console.error('Error updating username:', error);
      }
    } 

    // ------------------------------------------------------------Updating Bio --------------------------------------------------------------- */
/*     const [newBiography, setNewBiography] = useState("")

    const updateBio = async (newBio: string) => {

      try {
        setBio(newBio)
        setNewName("")
        const dbParams = {
          TableName: 'Players',
          Key: {PlayerID: primaryKey},
          UpdateExpression: 'SET Biography = :bio',
          ExpressionAttributeValues: {
            ':bio': newBio
          }
        }
        await dynamodb.update(dbParams).promise();
        console.log('Bio updated successfully!');

      } catch (error) {
        console.error('Error updating Bio:', error);
      }
    }  */

  /* ----------------------------------------- Animation ----------------------------------------------------------------- */
  const slideValue = useRef(new Animated.Value(Dimensions.get("window").width)).current;

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
  let [isLogoutVisible, setLogoutVisible] = useState(false)

  let [searchQuery, setSearchQuery] = useState("")
  let [filteredUsers, setFilteredUsers] = useState<user[]>()
  let [filteredStories, setFilteredStories] = useState()

  const handleSearch = (text: string) => {
    setSearchQuery(text)
    const filteredData = otherUsers.filter(name => name.Username.toLowerCase().includes(text.toLowerCase()) )
    setFilteredUsers(filteredData)
  }

  // Handle Logout functionality
  const handleLogout = () => {
    setLogoutVisible(false)
    signOutUser(); // Call signOutUser function to log the user out
    router.push('/'); // Redirect to login page after logging out
  };

  return (
    <SafeAreaView className="bg-backgroundSecondary flex-1">
      <KeyboardAvoidingView className="flex-1">

{/*--------------------------------------------------------------- EDIT -----------------------------------------------------------*/}
      <View className="w-full h-[60px] pl-4 justify-between flex flex-row">
        <Text style={{fontSize: 18, fontFamily: 'JetBrainsMonoRegular'}} className="color-white pt-6"> Profile </Text>
        <View className="flex flex-row justify-between w-[80px] pr-6 pt-6">
          {isGuest ? <View/> : <Pen size={20} color={"white"} onPress={() => {setEditVisible(true)}}/>}
          <LogOut size={20} color={"red"} onPress={() => {setLogoutVisible(true)}}/>
        </View>
      </View>

{/*--------------------------------------------------------------- LOG OUT -----------------------------------------------------------*/}
      <Modal animationIn={"slideInUp"} animationOut={"slideOutDown"} className="flex-1" style={{marginHorizontal: 0, marginBottom: 0, marginTop: Dimensions.get("window").height-80, }} 
             onBackdropPress={() => setLogoutVisible(false)}
             backdropOpacity={.5}
             isVisible={isLogoutVisible}>
              <View className="bg-background flex-1 rounded-t-3xl items-center justify-center">
                <TouchableOpacity className="w-3/4 h-1/2 bg-red-500 flex-row rounded-full items-center justify-center"
                                  onPress={() => {handleLogout()}}>
                  <LogOut size={20} color={"white"}></LogOut>
                  {isGuest ? <Text className="color-white" style={{fontSize: 18, fontFamily: 'JetBrainsMonoBold'}}> Exit </Text> : 
                             <Text className="color-white" style={{fontSize: 18, fontFamily: 'JetBrainsMonoBold'}}> Log Out </Text>}
                </TouchableOpacity>
              </View>
      </Modal>

{/*--------------------------------------------------------------- EDITING PROFILE -----------------------------------------------------------*/}
      <SafeAreaView className="flex-1">
      <Modal animationIn={"slideInRight"} animationOut={"slideOutRight"} className="flex-1" style={{marginHorizontal: 0, marginBottom: 0}} 
             isVisible={isEditVisible}>
        <View className="flex-1">
          <Image
            className="h-full w-full"
            style={{ resizeMode: 'cover', position: 'absolute' }}
            //source={require('assets/Homebg.png')}
            />
          <ScrollView className="flex-1 p-4 bg-background" automaticallyAdjustKeyboardInsets={true}>
            <View className="flex-1 flex-row">
              <Pen color={"white"}></Pen>
              <View className="flex-1 h-[40px] flex-row justify-between bg-background pl-2">
                <Text style={{fontFamily: 'JetBrainsMonoRegular', fontSize: 20, color: 'white'}}>Edit Profile</Text>
                <X color={"white"} onPress={() => {setEditVisible(false)}}/>
              </View>
            </View>
            <View className="flex flex-col flex-1">
        {/* ------------------------------------------------------ AVATAR ---------------------------------------------------*/}
            <View className="flex-1 flex flex-row">
              <IdCard size={20} color={"white"} />
              <Text style={{color: 'white', fontFamily: 'JetBrainsMonoRegular', fontSize: 16, paddingLeft: 4, paddingBottom: 10}}>Avatar</Text>
            </View>
            <View className="flex-1 flex flex-col items-center bg-backgroundSecondary rounded-xl py-6">
              <View className="w-full h-1/3 bg-backgroundSecondary rounded-t-xl" style={{position:'absolute'}}></View>
              <View className="w-full h-2/5 bg-primaryAccent rounded-t-xl" style={{position:'absolute'}}></View>
                <View className="pb-4 items-center justify-center flex-1">
                  <View className="bg-backgroundSecondary rounded-full w-[140px] h-[150px]" style={{position: 'absolute'}}></View>
                  <Avatar size={120} image={avatar}></Avatar>
                </View>
                <TouchableOpacity className="bg-primaryAccent w-[330px] h-[40px] justify-center items-center rounded-xl"
                                  onPress={() => {pickImage()}}>
                  <Text style={{fontFamily: 'JetBrainsMonoBold', color: "white"}}> Edit Avatar </Text>
                </TouchableOpacity>
            </View>
            <View className="bg-secondaryText h-[1px] w-full my-6"></View>
        {/* -------------------------------------------------- USERNAME -------------------------------------------------*/}
            <View className="flex-1 flex flex-row">
              <ALargeSmall size={20} color={"white"} />
              <Text style={{color: 'white', fontFamily: 'JetBrainsMonoRegular', fontSize: 16, paddingLeft: 4, paddingBottom: 10}}>Username</Text>
            </View>
              <View className="flex flex-col items-center justify-center bg-backgroundSecondary rounded-xl p-6">
                <TextInput 
                  className="bg-black color-white h-[40px] w-[330px] rounded-xl px-2"
                  placeholder = {username}
                  value={newName}
                  onChangeText={setNewName}
                  /> 
                <TouchableOpacity className="bg-primaryAccent w-[330px] h-[40px] justify-center items-center rounded-xl mt-4"
                                  onPress={() => {updateUsername(newName)}}>
                  <Text style={{fontFamily: 'JetBrainsMonoBold', color: "white"}}> Change Username </Text>
                </TouchableOpacity>
              </View>
              <View className="bg-secondaryText h-[1px] w-full my-6"></View>
        {/* -------------------------------------------------- BIO ----------------------------------------------------*/}
  { /* 
            <View className="flex-1 flex flex-row">
              <LetterText size={20} color={"white"} />
              <Text style={{color: 'white', fontFamily: 'JetBrainsMonoRegular', fontSize: 16, paddingLeft: 4, paddingBottom: 10}}>Biography</Text>
            </View>              
            <View className="flex flex-col items-center justify-center bg-backgroundSecondary rounded-xl p-6">
                <TextInput 
                  className="bg-black color-white h-[100px] w-[330px] rounded-xl px-2"
                  multiline={true}
                  placeholder = {bio}
                  value = {newBiography}
                  onChangeText={setNewBiography}
                  /> 
                <TouchableOpacity className="bg-primaryAccent w-[330px] h-[40px] justify-center items-center rounded-xl mt-4"
                                  onPress={() => {updateBio(newBiography)}}>
                  <Text style={{fontFamily: 'JetBrainsMonoBold', color: "white"}}> Change Bio </Text>
                </TouchableOpacity>
              </View>
              <View className="bg-secondaryText h-[1px] w-full my-6"></View>
  */}
  {/*---------------------------------------------------------------------------------------------------------*/}
            </View>
          </ScrollView>
        </View>
      </Modal>
      </SafeAreaView>

      <FlatList 
        ref={flatListRef}
        onScroll={handleScroll}
        className="bg-backgroundSecondary"
        data={searchQuery === "" ? stories : filteredStories}
        renderItem={({item, index}) =>  <View className="flex-1 bg-background">
                                        <StoryCard              
                                        key={index}
                                        count={index}
                                        text={item.text}
                                        story={item.aiPrompt}/>
                                        </View>
                                        }
        ListEmptyComponent={() => <View style={{flex: 1, backgroundColor: "#313338", paddingBottom: 500, paddingTop: 10, alignItems: 'center'}}>  
                                    {isGuest ? <Text 
                                                className="color-secondaryText"
                                                style={{fontFamily: 'JetBrainsMonoRegular'}}> Login to Save and See Past Stories! </Text> :
                                                <Text className="color-secondaryText"
                                                style={{fontFamily: 'JetBrainsMonoRegular'}}> No Stories Found! </Text>}
                                  </View>}              
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        ListHeaderComponent={
  // ------------------------------------------------------   Header Component -----------------------------------------------
      <View className="flex-1 bg-backgroundSecondary items-center justify-center">
        <View className="w-full items-center justify-center">
          {/* ----------------------------------------------- Avatar -----------------------------------------------------*/}
          <View className="w-2/3 flex-2 flex flex-col items-center">
            <Avatar size={100} image={avatar}></Avatar>
            <View className="h-[50px]">
              <Text style={{fontSize: 18, fontFamily: 'JetBrainsMonoRegular'}} className="color-white">{username}</Text>
            </View>
          </View>

          {/* ----------------------------------------------- SEARCH BAR -------------------------------------------------- */}
          {/* Note that this is just pretending to be apart of the header, it's actually apart of the darker section on top of it, so if there's any formatting issues change the height of that*/}
          <View className="bg-backgroundSecondary w-full"> 

            <View className="w-full justify-center items-center flex flex-row pb-3">
                <BookOpen size={30} color={isStoryVisible ? '#06D6A1' : 'white'} onPress={() => {setSearchQuery(""); setStoryVisible(true); setFollowingVisible(false); setSearchVisible(false)}}/>
            </View>
            
            <View className="w-full justify-center items-center flex flex-row">
              {isStoryVisible ? <View className="bg-primaryAccent w-[30px] h-[2px]"/> : <View />}
            </View> 

            <Text className="pl-8 pt-4 bg-background color-secondaryText" style={{fontFamily: 'JetBrainsMonoRegular'}}>Stories</Text>
            <View className="bg-background w-full items-center">
              <View className="flex flex-row mt-4 mb-2 items-center"> 
                <TextInput 
                  className="bg-backgroundSecondary color-white h-[40px] w-[330px] rounded-xl px-10"
                  placeholder = "Search Stories"
                  value={searchQuery}
                  onChangeText={handleSearch}/> 
                <View className="pl-2" style={{position: 'absolute'}}>
                  <Search size={20} color='#313338' />
                </View>
              </View>
            </View>

          </View>
        </View>
      </View>}>
      {/* --------------------------------------------------------------------------------------------------- */}
      </FlatList>

    {/*--------------------------------------------- Scroll to Top Button ----------------------------------------*/}
    <Animated.View style={{position: 'absolute', marginTop: Dimensions.get("screen").height-140, marginLeft: Dimensions.get("screen").width-60, transform: [{translateX: slideValue}]}}>
      <TouchableOpacity className="bg-primaryAccent h-[45px] w-[45px] rounded-full items-end"   
                      onPress={() => {scrollToTop()}}>
        <View className="flex-1 items-center justify-center pr-2">
          <ArrowUp size={30} color={'white'}></ArrowUp>
        </View> 
      </TouchableOpacity>
    </Animated.View>
    {/* ----------------------------------------------------------------------------------------------------------- */}
    </KeyboardAvoidingView>
    </SafeAreaView>
    <SafeAreaView className="flex-1 bg-background">
    <View className="mx-3 flex flex-1 justify-between">
      <Text className="mb-4 text-2xl font-bold text-backgroundText">Story History</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : (
        <ScrollView className="flex-1 space-y-3">
          {stories.map((story, idx) => (
            <TouchableOpacity
              key={idx}
              className="rounded-lg bg-secondary p-4"
              onPress={() => openStory(story)}>
              <Text className="text-lg font-semibold text-white">{story.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  </SafeAreaView>
  );
};
export default Profile;