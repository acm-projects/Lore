import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Asset } from 'expo-asset';
import { getUserCognitoSub } from '../(user_auth)/CognitoConfig';
import * as ImagePicker from 'expo-image-picker';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ScrollView,
  TextInput,
} from 'react-native'
import { router, useFocusEffect, useNavigation } from 'expo-router';
import { ALargeSmall, IdCard, Pen, X } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AWS from 'aws-sdk';
import { useFonts } from 'expo-font';
import { Audio } from 'expo-av';
import Avatar from '~/components/Avatar';
const Home = () => {

  useEffect(() => {

  }, []);
  const screenWidth = Dimensions.get('window').width;

      const soundRef = useRef<Audio.Sound | null>(null);
  
      const clickSFX = async () => {
        const { sound } = await Audio. Sound.createAsync(
          require('assets/click.mp3'),
        );
        soundRef.current = sound;
        await sound.playAsync();
      }
  
      useFonts({
        'JetBrainsMonoRegular': require('assets/fonts/JetBrainsMonoRegular.ttf'),
      });
  
      AWS.config.update({
        region: 'us-east-2',
      });
  
      const s3 = new AWS.S3()
      const dynamodb = new AWS.DynamoDB.DocumentClient()
      
      // ------------------------------------------- Guest User Details --------------------------------------------------------
      const [isGuest, setGuest] = useState(false)
      const [primaryKey, setPrimaryKey] = useState(0)
  
      const fetchGuestId = async () => {
        try {
          const guestId = await AsyncStorage.getItem('playerId');
          if (guestId !== null) {
            setPrimaryKey(parseInt(guestId))
           }
        } catch (error) {
          console.error('Error fetching identityId:', error);
        }
      };
  
      const guestParams = {
        TableName: 'Players',
        KeyConditionExpression: 'PlayerID = :subValue',
        ProjectionExpression: "Username, ProfilePicURL, PlayerID",
        ExpressionAttributeValues: {
          ':subValue': primaryKey
        }
      }
  
      const getGuestItems = async () => {
        dynamodb.query(guestParams, (err, data) => {
          if (err) {
            console.log('' + err)
          } else {
            data.Items?.forEach(item => {
              setUsername(item.Username)
              setAvatar(item.ProfilePicURL)
              setPrimaryKey(item.PlayerID)
            })
          }
        })
      }
  
      // ------------------------------------------- Logged On User Details --------------------------------------------------------
      const [username, setUsername] = useState("")
      const [cognitoSub, setCognitoSub] = useState("")
      const [avatar, setAvatar] = useState("")
      const [stories, setStories] = useState([])
      //const [friends, setFriends] = useState([])
      //const [bio, setBio] = useState("")
  
      const getCognitoSub = async () => { // Get username from Cognito Config in order to get primary key for secondary global index
        setCognitoSub(await getUserCognitoSub())
      }
  
      useFocusEffect(useCallback(() => { // Run these functions whenever profile page is loaded
        getCognitoSub()
      }, []))
  
      useEffect(() => {
        if(cognitoSub.length === 0) {
          setGuest(true)
          fetchGuestId()
          getGuestItems()
        } else {
          setGuest(false)
          getItems()
        }
      }, [cognitoSub || primaryKey])
  
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
              console.log(item)
              setUsername(item.Username)
              setAvatar(item.ProfilePicURL)
              setPrimaryKey(item.PlayerID)
            })
          }
        })
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
        console.log('Uploading...')
        const uploadResult = await s3.upload(params).promise();
        const dbParams = {
          TableName: 'Players',
          Key: {PlayerID: primaryKey},
          UpdateExpression: 'SET ProfilePicURL = :url',
          ExpressionAttributeValues: {
            ':url': uploadResult.Location
          }
        };
        console.log("Uploaded!")
        await dynamodb.update(dbParams).promise();
        setAvatar(imageUri)
        console.log('Profile picture updated successfully!');

      } catch (error) {
        console.error('Error uploading profile picture:', error);
      }  

    }

  return (
    <SafeAreaView className="flex-1 bg-backgroundSecondary">
    <View className="flex-1">
      <ScrollView className="flex-1 p-4 bg-background" automaticallyAdjustKeyboardInsets={true}>
        <View className="flex-1 flex-row">
          <Pen color={"white"}></Pen>
          <View className="flex-1 h-[40px] flex-row justify-between bg-background pl-2">
            <Text style={{fontFamily: 'JetBrainsMonoRegular', fontSize: 20, color: 'white'}}>Edit Profile</Text>
            <X color={"white"} onPress={() => {router.push('/(main)/profile')}}/>
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
  </SafeAreaView>
  );
};

export default Home;
