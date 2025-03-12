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
         TouchableOpacity,} from 'react-native';

const SignUp = () => {
    const styles = require('../globalStyles');
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="flex-1 bg-background">
                <Image className="w-full h-full" style={{resizeMode: 'cover', position: 'absolute'}} source={require("assets/Loginbg.png")}/> 
                <ScrollView automaticallyAdjustKeyboardInsets={true} className="">
                    <SafeAreaView className="justify-center items-center">
                        <Image 
                            source={require("assets/Logo 1.png")}
                            style={[{width: 300, height:150}, {resizeMode: "contain"}]}>
                        </Image>

                        <View style={styles.box}>
                            <View className="items-center m-4">
                                <Text className="font-jetbrainsmono-regular color-white">
                                    Welcome to Lore!
                                </Text>
                                <Text style={[styles.secondaryText, {fontSize: 12}]}>
                                    Start your storytelling journey here.
                                </Text>
                            </View>

                            <View className="mb-4">
                                <Text style={styles.secondaryText}>Username</Text>
                                <TextInput style={styles.textInput}/>
                            </View>

                            <View className="mb-4">
                                <Text style={styles.secondaryText}>Email</Text>
                                <TextInput style={styles.textInput}/>
                            </View>

                            <View className="mb-4">
                                <Text style={styles.secondaryText}>Password</Text>
                                <TextInput style={styles.textInput}/>
                            </View>

                            <View className="mb-4">
                                <Text style={styles.secondaryText}> Confirm Password</Text>
                                <TextInput style={styles.textInput}/>
                            </View>

                            <View className="m-4">
                                <TouchableOpacity style={styles.button} onPress={() => {router.push("/"); }}>
                                <Text style={styles.buttonText}> Sign Up </Text>
                                </TouchableOpacity>
                                <Text style={[styles.linkText, {fontSize: 12}]} onPress={() => {router.push("/"); }}> 
                                    Already have an account? 
                                </Text>
                            </View>
                        </View>
                    </SafeAreaView>
                </ScrollView>
            </View>
        </TouchableWithoutFeedback>
    )
}

export default SignUp;