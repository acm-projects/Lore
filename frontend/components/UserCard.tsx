import { useFonts } from 'expo-font';
import { router } from 'expo-router';
import React, { useState } from 'react'
import {View,
        Image,
        SafeAreaView,
        Text,
        TouchableOpacity
 } from 'react-native'

function UserCard (props: {name: string, image: string, friends: boolean})
{
    let [isFriend, setFriend] = useState(props.friends)
    let [isRequesting, setRequesting] = useState(false)

    const handleUnfriend = () => {
        setFriend(false)
        props.friends = false
    }

    useFonts({
        'JetBrainsMonoRegular': require('assets/fonts/JetBrainsMonoRegular.ttf'),
        'JetBrainsMonoBold': require('assets/fonts/JetBrainsMonoBold.ttf')
    });
    
    return( 
        <SafeAreaView className="flex-1 items-center my-2">
            <TouchableOpacity className="rounded-xl bg-backgroundSecondary h-[70px] w-[330px] items-center flex-row"
                              onPress={() => {router.push("/(social)/otherUserProfile")}}>

                <Image className="rounded-full ml-4" style={{width: 55, height: 55}} source={{uri : props.image}} />
                <View className="w-[130px] h-auto flex-row items-start">
                    <Text numberOfLines={1}
                          className="color-white" 
                          style={{fontSize: 12, fontFamily: 'JetBrainsMonoRegular', overflow: 'hidden'}}> {props.name} 
                    </Text>
                </View>

                <View className="justify-end items-end flex-1 mr-4">
                    {isFriend ? 
                        (<View className="">
                            <TouchableOpacity className="rounded-xl bg-backgroundSecondary h-[35px] w-[110px] justify-center items-center" 
                                                style={{borderColor: 'white', borderWidth: 2}}
                                                onPress={() => {handleUnfriend()}}>
                                <Text className="color-white" style={{fontSize: 15, fontFamily: 'JetBrainsMonoRegular'}}> Unfriend </Text>
                            </TouchableOpacity>   
                        </View>)
                        : 
                        (<View className="">
                            {isRequesting ? 
                                <TouchableOpacity className="rounded-xl bg-backgroundSecondary h-[35px] w-[110px] justify-center items-center" 
                                style={{borderColor: 'white', borderWidth: 2}}
                                onPress={() => {setRequesting(!isRequesting)}}>
                                    <Text className="color-white" style={{fontSize: 15, fontFamily: 'JetBrainsMonoRegular'}}> Requested </Text>
                                </TouchableOpacity> 
                            : 
                            <TouchableOpacity className="rounded-xl bg-primaryAccent h-[35px] w-[110px] justify-center items-center"
                            onPress={() => {setRequesting(!isRequesting)}}>
                                    <Text className="color-white" style={{fontSize: 15, fontFamily: 'JetBrainsMonoBold'}}> Add Friend </Text>
                                </TouchableOpacity> 
                            }    
                        </View>) 
                    }
                </View>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default UserCard