import React, { createRef, useCallback, useEffect, useRef, useState } from 'react';
import { router, useLocalSearchParams, Stack, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import data from '~/data/data.json';
import { useFonts } from 'expo-font';
import Modal from 'react-native-modal';
import {
  ALargeSmall,
  ArrowUp,
  BookOpen,
  IdCard,
  Info,
  LogOut,
  Pen,
  Search,
  UserRoundPlus,
  UsersRound,
  X,
} from 'lucide-react-native';
import StoryCard from '~/components/StoryCard';
import UserCard from '~/components/UserCard';
import Avatar from '~/components/Avatar';
import * as ImagePicker from 'expo-image-picker';
import {
  signOutUser,
  getUserAttributes,
  getUserCognitoSub,
} from 'app/(user_auth)/CognitoConfig.js'; // Import signOutUser from CognitoConfig.js
import AWS, { DynamoDB } from 'aws-sdk';
import { DynamoDBClient, ListBackupsCommand } from '@aws-sdk/client-dynamodb';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import {
  View,
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
} from 'react-native';

const Profile = () => {
  const soundRef = useRef<Audio.Sound | null>(null);

  const clickSFX = async () => {
    const { sound } = await Audio.Sound.createAsync(require('assets/click.mp3'));
    soundRef.current = sound;
    await sound.playAsync();
  };

  useFonts({
    JetBrainsMonoRegular: require('assets/fonts/JetBrainsMonoRegular.ttf'),
  });

  AWS.config.update({
    accessKeyId: process.env.EXPO_PUBLIC_ACCESS_KEY,
    secretAccessKey: process.env.EXPO_PUBLIC_SECRET_KEY,
    region: 'us-east-2',
  });

  const s3 = new AWS.S3();
  const dynamodb = new AWS.DynamoDB.DocumentClient();

  // ------------------------------------------- Guest User Details --------------------------------------------------------
  const [isGuest, setGuest] = useState(false);
  const [primaryKey, setPrimaryKey] = useState(0);

  const fetchGuestId = async () => {
    try {
      const guestId = await AsyncStorage.getItem('playerId');
      if (guestId !== null) {
        setPrimaryKey(parseInt(guestId));
      }
    } catch (error) {
      console.error('Error fetching identityId:', error);
    }
  };

  const guestParams = {
    TableName: 'Players',
    KeyConditionExpression: 'PlayerID = :subValue',
    ProjectionExpression: 'Username, ProfilePicURL, PlayerID',
    ExpressionAttributeValues: {
      ':subValue': primaryKey,
    },
  };

  const getGuestItems = async () => {
    dynamodb.query(guestParams, (err, data) => {
      if (err) {
        console.log('' + err);
      } else {
        data.Items?.forEach((item) => {
          console.log(item);
          setUsername(item.Username);
          setAvatar(item.ProfilePicURL);
          setPrimaryKey(item.PlayerID);
        });
      }
    });
  };

  // ------------------------------------------- Logged On User Details --------------------------------------------------------
  const [username, setUsername] = useState('');
  const [cognitoSub, setCognitoSub] = useState('');
  const [avatar, setAvatar] = useState('');
  const [stories, setStories] = useState([]);
  //const [friends, setFriends] = useState([])
  //const [bio, setBio] = useState("")

  const getCognitoSub = async () => {
    // Get username from Cognito Config in order to get primary key for secondary global index
    setCognitoSub(await getUserCognitoSub());
  };

  useFocusEffect(
    useCallback(() => {
      // Run these functions whenever profile page is loaded
      getCognitoSub();
    }, [])
  );

  useEffect(() => {
    if (cognitoSub.length === 0) {
      setGuest(true);
      fetchGuestId();
      getGuestItems();
    } else {
      setGuest(false);
      getItems();
    }
  }, [cognitoSub || primaryKey]);

  const queryParams = {
    TableName: 'Players',
    IndexName: 'CognitoSub-index',
    KeyConditionExpression: 'CognitoSub = :subValue',
    ProjectionExpression: 'Username, Email, Friends, ProfilePicURL, Stories, PlayerID, Biography',
    ExpressionAttributeValues: {
      ':subValue': cognitoSub,
    },
  };

  const getItems = async () => {
    dynamodb.query(queryParams, (err, data) => {
      if (err) {
        console.log('' + err);
      } else {
        data.Items?.forEach((item) => {
          setUsername(item.Username);
          setAvatar(item.ProfilePicURL);
          setPrimaryKey(item.PlayerID);
        });
      }
    });
  };

  // ---------------------------------------------- Log Out / Exit ------------------------------------------------------------

  const deleteGuestParams = {
    TableName: 'Players',
    Key: {
      PlayerID: primaryKey,
    },
  };

  // Handle Logout functionality
  const handleLogout = async () => {
    setLogoutVisible(false);
    if (isGuest) {
      // If the user is a guest, delete the dynamoDb table and asyncStorage
      await AsyncStorage.removeItem('playerId');
      dynamodb.delete(deleteGuestParams, (err, data) => {
        if (err) {
          console.log('Error', err);
        } else {
          console.log('Success', data);
        }
      });
    }
    signOutUser(); // Call signOutUser function to log the user out
    router.push('/'); // Redirect to login page after logging out
  };

  // ------------------------------------------- Get other Users --------------------------------------------------------
  type user = {
    Biography: string;
    CognitoSub: string;
    CreatedAt: string;
    Email: string;
    Friends: {};
    PlayerID: number;
    Stories: number;
    StoriesParticipated: {};
    Username: string;
  };
  const [otherUsers, setOtherUsers] = useState<user[]>([]);

  const scanItems = async () => {
    const items = await dynamodb.scan({ TableName: 'Players' }).promise();

    setOtherUsers((items.Items as user[]) || []);
  };

  // ------------------------------------------- Profile Pictures Picking --------------------------------------------------------
  const [image, setImage] = useState<string>('');

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
    console.log('Ran');
    uploadImageToS3(image, '' + primaryKey);
  };

  // ------------------------------------------- Uploading to S3 Bucket + Updating Profile Picture --------------------------------------------------------
  const uploadImageToS3 = async (imageUri: string, imageName: string) => {
    const params = {
      Bucket: 'loreprofilepictures',
      Key: `profile-pictures/${imageName}`,
      Body: await fetch(imageUri).then((res) => res.blob()),
      ContentType: 'image/jpeg',
      ACL: 'public-read',
    };

    try {
      console.log('Uploading...');
      const uploadResult = await s3.upload(params).promise();
      setAvatar(imageUri);
      const dbParams = {
        TableName: 'Players',
        Key: { PlayerID: primaryKey },
        UpdateExpression: 'SET ProfilePicURL = :url',
        ExpressionAttributeValues: {
          ':url': uploadResult.Location,
        },
      };
      console.log('Uploaded!');

      await dynamodb.update(dbParams).promise();
      console.log('Profile picture updated successfully!');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
  };
  // ------------------------------------------------------------Updating Username --------------------------------------------------------------- */
  const [newName, setNewName] = useState('');

  const updateUsername = async (newUsername: string) => {
    try {
      setUsername(newUsername); // Set the original username to function username parameter
      setNewName('');
      const dbParams = {
        TableName: 'Players',
        Key: { PlayerID: primaryKey },
        UpdateExpression: 'SET Username = :username',
        ExpressionAttributeValues: {
          ':username': newUsername,
        },
      };
      await dynamodb.update(dbParams).promise();

      console.log('Username updated successfully!');
    } catch (error) {
      console.error('Error updating username:', error);
    }
  };

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
  const slideValue = useRef(useAnimatedValue(Dimensions.get('window').width)).current;

  const slideOutAnimation = () => {
    Animated.timing(slideValue, {
      toValue: 0,
      duration: 400,
      useNativeDriver: false,
    }).start();
  };

  const slideInAnimation = () => {
    Animated.timing(slideValue, {
      toValue: Dimensions.get('window').width,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  // ----------------------------------- Scrolling Functionality -----------------------------------------------------------
  let flatListRef = createRef<FlatList<any>>();

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const handleScroll = (event: any) => {
    // If user scrolls to around the top, get rid of the scroll to top button
    if (event.nativeEvent.contentOffset.y < 150) {
      slideInAnimation();
    } else {
      slideOutAnimation();
    }
  };
  // ------------------------------------------------------------------------------------------------------------------------

  let [isStoryVisible, setStoryVisible] = useState(true);
  let [isEditVisible, setEditVisible] = useState(false);
  let [isLogoutVisible, setLogoutVisible] = useState(false);
  let [isInfoVisible, setInfoVisible] = useState(false);
  let [searchQuery, setSearchQuery] = useState('');
  let [filteredStories, setFilteredStories] = useState();

  // Scrapped State Variables for Friends Feature
  let [isFollowingVisible, setFollowingVisible] = useState(false);
  let [isSearchVisible, setSearchVisible] = useState(false);
  let [filteredUsers, setFilteredUsers] = useState<user[]>();

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const filteredData = otherUsers.filter((name) =>
      name.Username.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredUsers(filteredData);
  };

  return (
    <SafeAreaView className="flex-1 bg-backgroundSecondary">
      <KeyboardAvoidingView className="flex-1">
        {/*--------------------------------------------------------------- EDIT -----------------------------------------------------------*/}
        <View className="flex h-[60px] w-full flex-row justify-between pl-4">
          <Text
            style={{ fontSize: 18, fontFamily: 'JetBrainsMonoRegular' }}
            className="pt-6 color-white">
            {' '}
            Profile{' '}
          </Text>
          <View className="flex w-[100px] flex-row justify-between pr-6 pt-6">
            <Info
              size={20}
              color={'white'}
              onPress={() => {
                setInfoVisible(true);
              }}
            />
            {isGuest ? (
              <View />
            ) : (
              <Pen
                size={20}
                color={'white'}
                onPress={() => {
                  setEditVisible(true);
                }}
              />
            )}
            <LogOut
              size={20}
              color={'red'}
              onPress={() => {
                setLogoutVisible(true);
              }}
            />
          </View>
        </View>

        {/*--------------------------------------------------------------- LOG OUT -----------------------------------------------------------*/}
        <Modal
          animationIn={'slideInUp'}
          animationOut={'slideOutDown'}
          className="flex-1"
          style={{
            marginHorizontal: 0,
            marginBottom: 0,
            marginTop: Dimensions.get('window').height - 80,
          }}
          onBackdropPress={() => setLogoutVisible(false)}
          backdropOpacity={0.5}
          isVisible={isLogoutVisible}>
          <View className="flex-1 items-center justify-center rounded-t-3xl bg-background">
            <TouchableOpacity
              className="h-1/2 w-3/4 flex-row items-center justify-center rounded-full bg-red-500"
              onPress={() => {
                handleLogout();
              }}>
              <LogOut size={20} color={'white'}></LogOut>
              {isGuest ? (
                <Text
                  className="color-white"
                  style={{ fontSize: 18, fontFamily: 'JetBrainsMonoBold' }}>
                  {' '}
                  Exit{' '}
                </Text>
              ) : (
                <Text
                  className="color-white"
                  style={{ fontSize: 18, fontFamily: 'JetBrainsMonoBold' }}>
                  {' '}
                  Log Out{' '}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </Modal>

        {/*--------------------------------------------------------------- EDITING PROFILE -----------------------------------------------------------*/}
        <Modal
          animationIn={'slideInRight'}
          animationOut={'slideOutRight'}
          className="flex-1"
          style={{ marginHorizontal: 0, marginBottom: 0 }}
          isVisible={isEditVisible}>
          <SafeAreaView className="flex-1">
            <View className="flex-1">
              <Image
                className="h-full w-full"
                style={{ resizeMode: 'cover', position: 'absolute' }}
                //source={require('assets/Homebg.png')}
              />
              <ScrollView
                className="flex-1 bg-background p-4"
                automaticallyAdjustKeyboardInsets={true}>
                <View className="flex-1 flex-row">
                  <Pen color={'white'}></Pen>
                  <View className="h-[40px] flex-1 flex-row justify-between bg-background pl-2">
                    <Text
                      style={{ fontFamily: 'JetBrainsMonoRegular', fontSize: 20, color: 'white' }}>
                      Edit Profile
                    </Text>
                    <X
                      color={'white'}
                      onPress={() => {
                        setEditVisible(false);
                      }}
                    />
                  </View>
                </View>
                <View className="flex flex-1 flex-col">
                  {/* ------------------------------------------------------ AVATAR ---------------------------------------------------*/}
                  <View className="flex flex-1 flex-row">
                    <IdCard size={20} color={'white'} />
                    <Text
                      style={{
                        color: 'white',
                        fontFamily: 'JetBrainsMonoRegular',
                        fontSize: 16,
                        paddingLeft: 4,
                        paddingBottom: 10,
                      }}>
                      Avatar
                    </Text>
                  </View>
                  <View className="flex flex-1 flex-col items-center rounded-xl bg-backgroundSecondary py-6">
                    <View
                      className="h-1/3 w-full rounded-t-xl bg-backgroundSecondary"
                      style={{ position: 'absolute' }}></View>
                    <View
                      className="h-2/5 w-full rounded-t-xl bg-primaryAccent"
                      style={{ position: 'absolute' }}></View>
                    <View className="flex-1 items-center justify-center pb-4">
                      <View
                        className="h-[150px] w-[140px] rounded-full bg-backgroundSecondary"
                        style={{ position: 'absolute' }}></View>
                      <Avatar size={120} image={avatar}></Avatar>
                    </View>
                    <TouchableOpacity
                      className="h-[40px] w-[330px] items-center justify-center rounded-xl bg-primaryAccent"
                      onPress={() => {
                        pickImage();
                      }}>
                      <Text style={{ fontFamily: 'JetBrainsMonoBold', color: 'white' }}>
                        {' '}
                        Edit Avatar{' '}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View className="my-6 h-[1px] w-full bg-secondaryText"></View>
                  {/* -------------------------------------------------- USERNAME -------------------------------------------------*/}
                  <View className="flex flex-1 flex-row">
                    <ALargeSmall size={20} color={'white'} />
                    <Text
                      style={{
                        color: 'white',
                        fontFamily: 'JetBrainsMonoRegular',
                        fontSize: 16,
                        paddingLeft: 4,
                        paddingBottom: 10,
                      }}>
                      Username
                    </Text>
                  </View>
                  <View className="flex flex-col items-center justify-center rounded-xl bg-backgroundSecondary p-6">
                    <TextInput
                      className="h-[40px] w-[330px] rounded-xl bg-black px-2 color-white"
                      placeholder={username}
                      value={newName}
                      onChangeText={setNewName}
                    />
                    <TouchableOpacity
                      className="mt-4 h-[40px] w-[330px] items-center justify-center rounded-xl bg-primaryAccent"
                      onPress={() => {
                        updateUsername(newName);
                      }}>
                      <Text style={{ fontFamily: 'JetBrainsMonoBold', color: 'white' }}>
                        {' '}
                        Change Username{' '}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View className="my-6 h-[1px] w-full bg-secondaryText"></View>
                  {/* -------------------------------------------------- BIO ----------------------------------------------------*/}
                  {/* 
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
          </SafeAreaView>
        </Modal>
        {/*--------------------------------------------------------------- LOG OUT -----------------------------------------------------------*/}
        <Modal
          animationIn={'slideInUp'}
          animationOut={'slideOutDown'}
          className="flex-1"
          style={{ marginHorizontal: 50, marginVertical: 250 }}
          onBackdropPress={() => setInfoVisible(false)}
          backdropOpacity={0.5}
          isVisible={isInfoVisible}>
          <View className="flex-1 items-center justify-center rounded-3xl bg-background">
            <Text
              style={{ fontFamily: 'JetBrainsMonoRegular', color: 'white', textAlign: 'center' }}>
              Music by Eric Matyas{'\n'}
              "Quirky-Rhythm-2", "Puzzle-dreams", "Video-Game-brain-drain", "do-it", "Light Puzzles
              3" {'\n'}
              www.soundimage.org
            </Text>
          </View>
        </Modal>

        <FlatList
          ref={flatListRef}
          onScroll={handleScroll}
          className="bg-backgroundSecondary"
          data={searchQuery === '' ? stories : filteredStories}
          renderItem={({ item, index }) => (
            <View className="flex-1 bg-background">
              <StoryCard key={index} count={index} text={item.text} story={item.aiPrompt} />
            </View>
          )}
          ListEmptyComponent={() => (
            <View
              style={{
                flex: 1,
                backgroundColor: '#313338',
                paddingBottom: 500,
                paddingTop: 10,
                alignItems: 'center',
              }}>
              {isGuest ? (
                <Text
                  className="color-secondaryText"
                  style={{ fontFamily: 'JetBrainsMonoRegular' }}>
                  {' '}
                  Login to Save and See Past Stories!{' '}
                </Text>
              ) : (
                <Text
                  className="color-secondaryText"
                  style={{ fontFamily: 'JetBrainsMonoRegular' }}>
                  {' '}
                  No Stories Found!{' '}
                </Text>
              )}
            </View>
          )}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          ListHeaderComponent={
            // ------------------------------------------------------   Header Component -----------------------------------------------
            <View className="flex-1 items-center justify-center bg-backgroundSecondary">
              <View className="w-full items-center justify-center">
                {/* ----------------------------------------------- Avatar -----------------------------------------------------*/}
                <View className="flex-2 flex w-2/3 flex-col items-center">
                  <Avatar size={100} image={avatar}></Avatar>
                  <View className="h-[50px]">
                    <Text
                      style={{ fontSize: 18, fontFamily: 'JetBrainsMonoRegular' }}
                      className="color-white">
                      {username}
                    </Text>
                  </View>
                </View>

                {/* ----------------------------------------------- SEARCH BAR -------------------------------------------------- */}
                {/* Note that this is just pretending to be apart of the header, it's actually apart of the darker section on top of it, so if there's any formatting issues change the height of that*/}
                <View className="w-full bg-backgroundSecondary">
                  <View className="flex w-full flex-row items-center justify-center pb-3">
                    <BookOpen
                      size={30}
                      color={isStoryVisible ? '#06D6A1' : 'white'}
                      onPress={() => {
                        setSearchQuery('');
                        setStoryVisible(true);
                        setFollowingVisible(false);
                        setSearchVisible(false);
                      }}
                    />
                  </View>

                  <View className="flex w-full flex-row items-center justify-center">
                    {isStoryVisible ? (
                      <View className="h-[2px] w-[30px] bg-primaryAccent" />
                    ) : (
                      <View />
                    )}
                  </View>

                  <Text
                    className="bg-background pl-8 pt-4 color-secondaryText"
                    style={{ fontFamily: 'JetBrainsMonoRegular' }}>
                    Stories
                  </Text>
                  <View className="w-full items-center bg-background">
                    <View className="mb-2 mt-4 flex flex-row items-center">
                      <TextInput
                        className="h-[40px] w-[330px] rounded-xl bg-backgroundSecondary px-10 color-white"
                        placeholder="Search Stories"
                        value={searchQuery}
                        onChangeText={handleSearch}
                      />
                      <View className="pl-2" style={{ position: 'absolute' }}>
                        <Search size={20} color="#313338" />
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          }>
          {/* --------------------------------------------------------------------------------------------------- */}
        </FlatList>

        {/*--------------------------------------------- Scroll to Top Button ----------------------------------------*/}
        <Animated.View
          style={{
            position: 'absolute',
            marginTop: Dimensions.get('screen').height - 140,
            marginLeft: Dimensions.get('screen').width - 60,
            transform: [{ translateX: slideValue }],
          }}>
          <TouchableOpacity
            className="h-[45px] w-[45px] items-end rounded-full bg-primaryAccent"
            onPress={() => {
              scrollToTop();
            }}>
            <View className="flex-1 items-center justify-center pr-2">
              <ArrowUp size={30} color={'white'}></ArrowUp>
            </View>
          </TouchableOpacity>
        </Animated.View>
        {/* ----------------------------------------------------------------------------------------------------------- */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Profile;
