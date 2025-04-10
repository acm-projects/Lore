import React, { useCallback, useEffect, useRef, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { ChevronLeft} from 'lucide-react-native';
import {View, 
        Text, 
        TextInput,
        TouchableOpacity,
        ScrollView,
        Image,
        } from 'react-native';
import AWS from 'aws-sdk';

const guestDetails = () => {

    AWS.config.update({
        accessKeyId: 'AKIAQQABDJ7GWG7CMXGN',
        secretAccessKey: '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',
        region: 'us-east-2',
        credentials: new AWS.CognitoIdentityCredentials({
            IdentityPoolId: 'us-east-2:c8b301b1-f48a-47c6-832f-73eeeb9e54cc',
          }),
    })

    useFonts({
    'JetBrainsMonoRegular': require('assets/fonts/JetBrainsMonoRegular.ttf'),
    });

    const s3 = new AWS.S3()
    const dynamodb = new AWS.DynamoDB.DocumentClient()

    const [username, setUsername] = useState("")
    const [newName, setNewName] = useState("")
    const [primaryKey, setPrimaryKey] = useState("")
    const [avatar, setAvatar] = useState("")
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');
    
    useFocusEffect(useCallback(() => { // Run these functions whenever profile page is loaded
        setAvatar(defaultProfilePic()+"")
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

    const fetchIdentityID = async() => {
        try {
            // Wait for credentials to load using type assertion
            await (AWS.config.credentials as AWS.CognitoIdentityCredentials).getPromise();
        
            // Access identityId only after the credentials are fully loaded
            const credentials = AWS.config.credentials;
            if (credentials instanceof AWS.CognitoIdentityCredentials) {
              const identityId = credentials.identityId;
              console.log('identityId:', identityId);  // Should be defined here
            } else {
              console.error('Failed to get Cognito Identity Credentials');
            }
          } catch (error) {
            console.error('Error loading credentials:', error);
          }
        };

    const createGuestAccount = async (newUsername: string) => {

        try {
          setUsername(newUsername) // Set the original username to function username parameter
          setNewName("")
          const dbParams = {
            TableName: 'Players',
            Item: {
                PlayerID: primaryKey,
                Username: newUsername,
                ProfilePicURL: avatar
            },
          }
          await dynamodb.put(dbParams).promise();
          setSuccessMessage('Guest Profile created successfully!');
          router.push('/(main)/home')
  
        } catch (error) {
          console.error('Error creating Guest:', error);
        }
    } 

  return (
    <SafeAreaView className="flex-1 bg-background justify-center">
        <Image className="w-full h-full" style={{ resizeMode: 'cover', position: 'absolute', opacity: .5 }} source={require('assets/Homebg.png')} />
        
        <ScrollView className="flex-1" automaticallyAdjustKeyboardInsets={true}>
            <View className="h-[40px] flex-row p-4">
                <ChevronLeft size={25} color={"white"} onPress={() => {router.push('/')}}/>
            </View>
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
                        {successMessage && <Text style={{ color: 'green', fontFamily: 'JetBrainsMonoRegular', paddingBottom: 6}}>{successMessage}</Text>}
                </View>
            <View className="h-[1px] w-full my-6"></View>
    {/* -------------------------------------------------- Continue Button -------------------------------------------------*/}
                <View className="flex flex-col w-[350px] items-center justify-center bg-backgroundSecondary rounded-xl p-6">
                    <TouchableOpacity className="bg-primaryAccent w-[330px] h-[40px] justify-center items-center rounded-xl"
                                        onPress={() => {createGuestAccount(newName)}}>
                        <Text style={{fontFamily: 'JetBrainsMonoBold', color: "white"}}> Continue </Text>
                    </TouchableOpacity>
                </View>
          </View>
        </ScrollView>
    </SafeAreaView>
  );
};

export default guestDetails;
