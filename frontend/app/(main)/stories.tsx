import { View, Text, Alert, Dimensions, Image, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '~/components/Button';
import { router, useFocusEffect, useNavigation } from 'expo-router';
import { socket } from '~/socket';
import Animated, { BounceInDown, BounceInUp, Easing, useSharedValue, withSpring } from 'react-native-reanimated';
import { useFonts } from 'expo-font';

const Stories = () => {
  const createGameRoom = () => {
    socket.emit('create_room', (response: any) => {
      if (response.success) {
        router.push(`/(game)/lobby?lobbyCode=${response.roomCode}`);
      } else {
        Alert.alert('Error', 'Failed to create room. Try again.');
      }
    });
  };

  useFonts({
    'JetBrainsMonoRegular': require('assets/fonts/JetBrainsMonoRegular.ttf'),
    'JetBrainsMonoBold': require('assets/fonts/JetBrainsMonoBold.ttf'),
  });

  const navigation = useNavigation();
  const [loadBG, setLoadBG] = useState(false)
  
  useFocusEffect(useCallback(() => {
    setLoadBG(true)
  }, []))
  
  useEffect(() => {
    const leavePage = navigation.addListener('blur', () => {
      setLoadBG(false)
    })

    return () => {
      leavePage()
    }
  }, [navigation]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex flex-1 pt-10">
        <Image
          className="h-full w-full"
          style={{ resizeMode: 'cover', position: 'absolute', opacity: .5}}
          source={require('assets/Homebg.png')}
        />

        <Text className="w-full h-full color-white pt-5" 
              style={{fontFamily: 'JetBrainsMonoBold', position: 'absolute', fontSize: 25, textAlign: 'center'}}> 
              Start Your Thrilling Journey! 
        </Text>
        <View className="flex-1" style={{paddingTop: 100}}>

          {loadBG ? <Animated.View entering={BounceInUp.duration(2500).easing(Easing.inOut(Easing.quad))}>
          <Image style={{ // Clouds
                          width: Dimensions.get("screen").width,
                          height: 230,
                          overflow: 'hidden',
                          position: 'absolute',
                          resizeMode: 'contain',
                          marginTop: -100,
                          }}
                    source={require('assets/createStoryVector5.png')}>
            </Image>
          </Animated.View> 
          : <View/>}

          {loadBG ? <Animated.View entering={BounceInDown.duration(2000).easing(Easing.inOut(Easing.quad))}>
            <Image style={{ // Grey Hill
                          width: 270,
                          height: 330,
                          overflow: 'hidden',
                          position: 'absolute',
                          resizeMode: 'cover',
                          marginTop: Dimensions.get("screen").height-650,
                          marginLeft: 120
                        }}
                        source={require('assets/createStoryVector6.png')}>
            </Image>
          </Animated.View> 
          : <View/>}

          {loadBG ? <Animated.View entering={BounceInDown.duration(2000).easing(Easing.inOut(Easing.quad))}>
            <Image style={{ // Blue Hill
                          width: 325,
                          height: 250,
                          overflow: 'hidden',
                          position: 'absolute',
                          marginTop: Dimensions.get("screen").height-450,
                          marginRight: 100
                        }}
                        source={require('assets/createStoryVector2.png')}>
            </Image>
          </Animated.View> 
          : <View/>}

          {loadBG ? <Animated.View entering={BounceInDown.duration(2500).easing(Easing.inOut(Easing.quad))}>
          <Image style={{ // castle
                          width: 180,
                          height: 420,
                          overflow: 'hidden',
                          position: 'absolute',
                          resizeMode: 'contain',
                          marginTop: Dimensions.get("screen").height-670,
                          marginRight: 100
                          }}
                    source={require('assets/createStoryVector4.png')}>
            </Image>
          </Animated.View> 
          : <View/>}

          {loadBG ? <Animated.View entering={BounceInDown.duration(1700).easing(Easing.inOut(Easing.quad))}>
          <Image style={{ // Green Hill
                          width: 380,
                          height: 270,
                          overflow: 'hidden',
                          position: 'absolute',
                          marginTop: Dimensions.get("screen").height-400
                          }}
                    source={require('assets/createStoryVector1.png')}>
            </Image>
          </Animated.View> 
          : <View/>}

          {loadBG ? <Animated.View entering={BounceInDown.duration(2700).easing(Easing.inOut(Easing.quad))}>
          <Image style={{ // Robot
                          width: 150,
                          height: 150,
                          overflow: 'hidden',
                          position: 'absolute',
                          marginTop: Dimensions.get("screen").height-530,
                          marginLeft: 220
                          }}
                    source={require('assets/createStoryVector3.png')}>
            </Image>
          </Animated.View> 
          : <View/>}

        </View>

        <View className="flex w-full flex-row gap-x-3 py-4 px-8 items-center justify-between">

          <TouchableOpacity className="bg-primary w-[150px] h-[50px] justify-center items-center rounded-xl"  
                            onPress={() => {createGameRoom()}}>
              <Text className="" style={{fontFamily: 'JetBrainsMonoBold', fontSize: 15, textAlign: 'center'}}>
                Create Story
              </Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-secondaryText w-[150px] h-[50px] justify-center items-center rounded-xl"  
                            onPress={() => {router.push('/(game)/join-game')}}>
              <Text className="" style={{fontFamily: 'JetBrainsMonoBold', fontSize: 15, textAlign: 'center'}}>
                Join Story
              </Text>
          </TouchableOpacity>

        </View>
      </View>
    </SafeAreaView>
  );
};

export default Stories;
