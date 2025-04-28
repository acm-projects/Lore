import React, { useCallback, useEffect, useRef, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { ChevronLeft} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AWS from 'aws-sdk';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native';
import {View, 
        Text, 
        TextInput,
        TouchableOpacity,
        ScrollView,
        Image,
        } from 'react-native';

const guestDetails = () => {

    const navigation = useNavigation()

    useFonts({
    'JetBrainsMonoRegular': require('assets/fonts/JetBrainsMonoRegular.ttf'),
    });

    AWS.config.update({
        accessKeyId: 'AKIAQQABDJ7GWG7CMXGN',
        secretAccessKey: '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',
        region: 'us-east-2',
    });

    const dynamodb = new AWS.DynamoDB.DocumentClient()
  
    const [username, setUsername] = useState("")
    const [newName, setNewName] = useState("")
    const [primaryKey, setPrimaryKey] = useState(0)
    const [avatar, setAvatar] = useState("")
    const [expirationTime, setExpirationTime] = useState(0)

/* 
    const [guestKey, setGuestKey] = useState("")
    const getGuestId = () => {
        console.log("Role ARN:", (AWS.config.credentials as any)?.roleArn);
        (AWS.config.credentials as AWS.CognitoIdentityCredentials).get((err) => {
          if (err) {
            console.error('Error getting credentials:', err);
            return;
          }
          const credentials = AWS.config.credentials;
          if (credentials instanceof AWS.CognitoIdentityCredentials) {
            const identityId = credentials.identityId;
            console.log('identityId:', identityId);
            setGuestKey(identityId)
            storeIdentityId(identityId)
          } else {
            console.error('Failed to get Cognito Identity Credentials');
          }
        });
      };
       */
    const storePrimaryKey = async (playerId: number) => {
    try {
        await AsyncStorage.setItem('playerId', playerId+"");
    } catch (error) {
        console.error('Error storing playerId:', error);
        }
    };

    useFocusEffect(useCallback(() => { // Run these functions whenever profile page is loaded
        const expireTime = Math.floor(new Date().getTime() + 86400)
        setAvatar(defaultProfilePic()+"")
        setPrimaryKey(Math.round((Math.random()*9000000000))+1000000000)
        setExpirationTime(expireTime)
    }, []))

    const defaultProfilePic = () => { // Choose a random profile picture from 7
        const randomNum = Math.floor(Math.random() * 7) + 1;
        switch(randomNum) {
            case 1:
                return "https://loreprofilepictures.s3.us-east-2.amazonaws.com/profile-pictures/loreDefaultProfilePic1.png";
                break;
            case 2:
                return "https://loreprofilepictures.s3.us-east-2.amazonaws.com/profile-pictures/loreDefaultProfilePic2.png";
                break;
            case 3:
                return "https://loreprofilepictures.s3.us-east-2.amazonaws.com/profile-pictures/loreDefaultProfilePic3.png";
                break;
            case 4:
                return "https://loreprofilepictures.s3.us-east-2.amazonaws.com/profile-pictures/loreDefaultProfilePic4.png";
                break;
            case 5:
                return "https://loreprofilepictures.s3.us-east-2.amazonaws.com/profile-pictures/loreDefaultProfilePic5.png";
                break;
            case 6:
                return "https://loreprofilepictures.s3.us-east-2.amazonaws.com/profile-pictures/loreDefaultProfilePic6.png";
                break;
            case 7:
                return "https://loreprofilepictures.s3.us-east-2.amazonaws.com/profile-pictures/loreDefaultProfilePic7.png";
                break;
        }
    }

    const createGuestAccount = async (newUsername: string) => {
        storePrimaryKey(primaryKey)
        try {
          setUsername(newUsername) // Set the original username to function username parameter
          setNewName("")
          const dbParams = {
            TableName: 'Players',
            Item: {
                PlayerID: primaryKey,
                Username: newUsername,
                ProfilePicURL: avatar,
                ExpiresAt: expirationTime
            },
          }
          await dynamodb.put(dbParams).promise();
          router.push('/(main)/stories')
  
        } catch (error) {
          console.error('Error creating Guest:', error);
        }
    } 

  return (
    <SafeAreaView className="flex-1 bg-background justify-center">
        <Image className="w-full h-full" style={{ resizeMode: 'cover', position: 'absolute', opacity: .5 }} source={require('assets/Homebg.png')} />
        
        <View className="h-[40px] flex-row p-4">
            <ChevronLeft size={25} color={"white"} onPress={() => {navigation.goBack()}}/>
        </View>

        <ScrollView className="flex-1" automaticallyAdjustKeyboardInsets={true}>
            <View className="w-full h-auto items-center pb-4">
                <Image 
                    source={require("assets/Logo 1.png")}
                    style={[{ width: 300, height: 100 }, { resizeMode: "cover" }]}>
                </Image>
                <Text 
                    className="color-secondaryText"
                    style={{fontFamily: 'JetBrainsMonoRegular'}}> Don't want to make an account? No Problem! </Text> 
            </View>

        {/* ------------------------------------------------------ Input Box ---------------------------------------------------*/}
            <View className="flex flex-col flex-1 justify-center items-center">
                <View className="w-[350px] h-[240px] flex flex-col items-center bg-backgroundSecondary rounded-xl py-6">
                    <View className="w-full h-1/3 bg-backgroundSecondary rounded-t-xl" style={{position:'absolute'}}></View>
                    <View className="w-full h-2/5 bg-primaryAccent rounded-t-xl" style={{position:'absolute'}}></View>
                        <View className="pb-4 items-center justify-center flex-1">
                            <View className="bg-backgroundSecondary rounded-full w-[140px] h-[150px]" style={{position: 'absolute'}}></View>
                            <Image 
                                source={require("assets/guestScreenAnim.gif")}
                                style={[{ width: 300, height: 160 }, { resizeMode: "contain" }]}>
                            </Image>
                        </View>
                        <TextInput 
                            className="bg-black color-white h-[40px] w-[330px] rounded-xl px-2"
                            placeholder = "Username"
                            placeholderTextColor={'#404040'}
                            value={newName}
                            onChangeText={setNewName}
                        /> 
                </View>
            <View className="h-[1px] w-full my-6"></View>
    {/* -------------------------------------------------- Continue Button -------------------------------------------------*/}
                <View className="flex flex-col w-[350px] items-center justify-center bg-backgroundSecondary rounded-xl p-6">
                    <TouchableOpacity className="bg-primaryAccent w-[330px] h-[40px] justify-center items-center rounded-xl"
                                        onPress={() => {createGuestAccount(newName)}}>
                        <Text style={{fontFamily: 'JetBrainsMonoBold', color: "white"}}> Continue as Guest </Text>
                    </TouchableOpacity>
                </View>
          </View>
        </ScrollView>
    </SafeAreaView>
  );
};

export default guestDetails;
