import React from 'react'
import { router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, 
         Text, 
         Image, 
         TextInput, 
         TouchableWithoutFeedback, 
         Keyboard, 
         ScrollView,
         TouchableOpacity,
         StatusBar,} from 'react-native';
import { useFonts } from 'expo-font';

const SignUp = () => {

    useFonts({
        'JetBrainsMonoRegular': require('assets/fonts/JetBrainsMonoRegular.ttf'),
        'JetBrainsMonoBold': require('assets/fonts/JetBrainsMono-ExtraBold.ttf')
    });

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView className="flex-1 bg-background">
            <StatusBar />
            <View className="flex-1 bg-background">
                <Image className="w-full h-full" style={{resizeMode: 'cover', position: 'absolute'}} source={require("assets/Loginbg.png")}/> 
                <ScrollView automaticallyAdjustKeyboardInsets={true} className="">
                    <View className="justify-center items-center">
                        <Image 
                            source={require("assets/Logo 1.png")}
                            style={[{width: 300, height:150}, {resizeMode: "contain"}]}>
                        </Image>

                        <View className="flex-1 bg-backgroundSecondary w-5/2 justify-center items-center rounded-xl">
                            <View className="items-center m-4">
                                <Text className="color-white" style={{fontSize: 18, fontFamily: 'JetBrainsMonoRegular'}}>
                                    Welcome to Lore!
                                </Text>
                                <Text className="color-secondaryText" style={{fontSize: 12, fontFamily: 'JetBrainsMonoRegular'}}>
                                    Start your storytelling journey here.
                                </Text>
                            </View>

                            <View className="mb-4">
                                <Text className="color-secondaryText pb-2" style={{fontSize: 15, fontFamily: 'JetBrainsMonoRegular'}}>Username</Text>
                                <TextInput className="pl-2 rounded-xl bg-black color-white h-[40px] w-[285px]" style={{fontSize:15}}/>
                            </View>

                            <View className="mb-4">
                                <Text className="color-secondaryText pb-2" style={{fontSize: 15, fontFamily: 'JetBrainsMonoRegular'}}>Email</Text>
                                <TextInput className="pl-2 rounded-xl bg-black color-white h-[40px] w-[285px]" style={{fontSize:15}}/>
                            </View>

                            <View className="mb-4">
                                <Text className="color-secondaryText pb-2" style={{fontSize: 15, fontFamily: 'JetBrainsMonoRegular'}}>Password</Text>
                                <TextInput className="pl-2 rounded-xl bg-black color-white h-[40px] w-[285px]" style={{fontSize:15}}/>
                            </View>

                            <View className="mb-4">
                                <Text className="color-secondaryText pb-2" style={{fontSize: 15, fontFamily: 'JetBrainsMonoRegular'}}> Confirm Password</Text>
                                <TextInput className="pl-2 rounded-xl bg-black color-white h-[40px] w-[285px]" style={{fontSize:15}}/>
                            </View>

                            <View className="m-4">
                                <TouchableOpacity className="items-center justify-center mb-2 rounded-3xl bg-primaryAccent color-white h-[40px] w-[285px]" 
                                                  onPress={() => {router.push("/"); }}>
                                <Text className="color-white" style={{fontFamily: 'JetBrainsMonoBold'}}> Sign Up </Text>
                                </TouchableOpacity>
                                <Text className="color-linkText" style={{fontSize: 12, fontFamily: 'JetBrainsMonoRegular'}} onPress={() => {router.push("/"); }}> 
                                    Already have an account? 
                                </Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}
export default SignUp;